// part 1: representing queries

/**
 * A given backend fetch can be represented in one of two states:
 * data (success) or error (failure).
 */
export type QueryResult<T, E> =
  | {
      status: "result";
      result: T;
    }
  | {
      status: "error";
      error: E;
    };

// Part 2: a typesafe fetch

/** this interface represents a failure of a request to complete. */
export type NetworkError = {
  kind: "network-error";
  errorObject: Error;
  url: string;
};
/** represents an http response with a "failed" status code */
export type HTTPStatusError = {
  kind: "status-error";
  code: number;
  statusText: string;
  url: string;
};
/**
 * There are two distinct types of fetch "errors".
 * the first, network errors, are thrown from the js process in cases such as:
 * - the network going down
 * - a request timing out
 * the second are calls that return a "failed" status code (4xx or 5xx).
 *
 * this interface clearly denotes which kind has occurred.
 */
export type FetchError = NetworkError | HTTPStatusError;

/**
 * this fetch will never throw, only return data
 */
export const typedFetch = async function <TData>(
  req: RequestInfo,
  init?: RequestInit
): Promise<QueryResult<TData, FetchError>> {
  const url = typeof req === "string" ? req : req.url;

  try {
    const data = await fetch(req, init);
    if (!data.ok) {
      return {
        status: "error",
        error: {
          kind: "status-error",
          code: data.status,
          statusText: data.statusText,
          url,
        },
      };
    }
    const result = await data.json();
    return {
      status: "result",
      result,
    };
  } catch (e) {
    return {
      status: "error",
      error: {
        kind: "network-error",
        errorObject: e,
        url,
      },
    };
  }
};
