// part 1: representing queries

/**
 * yay! it worked!
 */
export interface Success {
  status: "success";
}
/**
 * he's dead, jim
 */
export interface Failure {
  status: "error";
}
/**
 * A given backend fetch can be represented in one of two states:
 * data (success) or error (failure).
 */
export type QueryResult<S extends Success, F extends Failure> = S | F;

// Part 2: a typesafe fetch

/**
 * this interface represents a failure of a request to complete.
 * network errors are thrown from the js process in cases such as:
 * - the network going down
 * - a request timing out
 */
export interface NetworkFailure extends Failure {
  kind: "network-error";
  error: TypeError;
  url: string;
}
/**
 * represents an http response with a "failed" status code
 * "failed" = (4xx or 5xx) response.
 */
export interface BadHTTPStatus extends Failure {
  kind: "status-error";
  url: string;
  error: {
    code: number;
    statusText: string;
  };
}
/**
 * There are two distinct types of fetch "errors".
 * the first, network errors, are thrown from the js process in cases such as:
 * - the network going down
 * - a request timing out
 * the second are calls that return a "failed" status code (4xx or 5xx).
 *
 * this interface clearly denotes which kind has occurred.
 */
export interface FetchSuccess<TData> extends Success {
  result: TData;
}
export type FetchResult<TData> = QueryResult<
  FetchSuccess<TData>,
  NetworkFailure | BadHTTPStatus
>;

/**
 * this fetch will never throw, only return data
 */
export const typedFetch = async function <TData>(
  req: RequestInfo,
  init?: RequestInit
): Promise<FetchResult<TData>> {
  const url = typeof req === "string" ? req : req.url;

  try {
    const data = await fetch(req, init);
    if (!data.ok) {
      return {
        status: "error",
        kind: "status-error",
        url,
        error: {
          code: data.status,
          statusText: data.statusText,
        },
      };
    }
    const result: TData = await data.json();
    return {
      status: "success",
      result,
    };
  } catch (e) {
    return {
      status: "error",

      kind: "network-error",
      error: e,
      url,
    };
  }
};
