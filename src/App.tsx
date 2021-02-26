import React, { PropsWithChildren } from "react";

import { FetchResult, typedFetch } from "./typedFetch";
// part 3: using typedFetch

/**
 * the API url to our mock todos API
 */
const BASE_URL = "https://jsonplaceholder.typicode.com/todos";

/**
 * in this example, a call to /todos/:id will return the below response.
 */
type TodosResponse = {
  id: number;
  userId: number;
  completed: boolean;
  title: string;
};

/**
 * @param todoId - the todo to query for
 * @returns todo data
})
 */
const loadTodos = (todoId: string) => {
  return typedFetch<TodosResponse>(`${BASE_URL}/${todoId}`);
};

// step 4: use with react
export const TodoContext = React.createContext("1");

type UseFetchState<TData> = FetchResult<TData> | { status: "loading" };
/**
 * returns the state of an async operation and a refetch function.
 */
const useFetch = function <TData>(callback: () => Promise<FetchResult<TData>>) {
  const refetch = React.useCallback(() => {
    Promise.resolve(callback()).then((res) => setState(res));
  }, [callback]);

  const [state, setState] = React.useState<UseFetchState<TData>>({
    status: "loading",
  });

  React.useEffect(() => {
    refetch();
  }, [refetch]);

  return [state, refetch] as const;
};

/**
 * React Hook. reads the current todo id from context and returns its data.
 */
const useCurrentTodo = () => {
  const currentTodo = React.useContext(TodoContext);

  const callback = React.useCallback(() => loadTodos(currentTodo), [
    currentTodo,
  ]);
  const [query, refetch] = useFetch(callback);

  return [query, refetch] as const;
};

const RetryButton = ({
  retry,
  children,
}: PropsWithChildren<{ retry: () => void }>) => {
  return <button onClick={retry}>{children}</button>;
};

const MyTodos = () => {
  const [todoQuery, refetch] = useCurrentTodo();

  if (todoQuery.status === "loading") return <div>Loading</div>;
  if (todoQuery.status === "error") {
    if (todoQuery.kind === "network-error")
      return (
        <div>
          network error occurred. try{" "}
          <RetryButton retry={refetch}>refreshing.</RetryButton>
        </div>
      );
    return <div>HTTP error code {todoQuery.error.code}</div>;
  }
  return (
    <pre>
      <code>{todoQuery.status}</code>
      <code>{JSON.stringify(todoQuery.result, null, 2)}</code>
    </pre>
  );
};

export default MyTodos;
