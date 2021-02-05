import React, { PropsWithChildren } from "react";

import { FetchError, QueryResult, typedFetch } from "./typedFetch";
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

/**
 * Extends our Query result with a state to represent loading.
 */
type QueryOrLoading<T, E = FetchError> =
  | QueryResult<T, E>
  | { status: "loading" };

const useQuery = function <T, E>(callback: () => Promise<QueryResult<T, E>>) {
  const refetch = React.useCallback(() => {
    callback().then((res) => setState(res));
  }, [callback]);

  const [state, setState] = React.useState<QueryOrLoading<T, E>>({
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
  const [state, refetch] = useQuery(callback);
  return [state, refetch] as const;
};

const RetryButton = ({
  retry,
  children,
}: PropsWithChildren<{ retry: () => void }>) => {
  return <button onClick={retry}>{children}</button>;
};

const MyFavoriteColors = () => {
  const [todo, refetch] = useCurrentTodo();

  if (todo.status === "loading") return <div>Loading</div>;
  if (todo.status === "error") {
    if (todo.error.kind === "network-error")
      return (
        <div>
          network error occurred. try{" "}
          <RetryButton retry={refetch}>refreshing.</RetryButton>
        </div>
      );
    return <div>HTTP error code {todo.error.code}</div>;
  }
  return (
    <pre>
      <code>{todo.status}</code>
      <code>{JSON.stringify(todo.result, null, 2)}</code>
    </pre>
  );
};

export default MyFavoriteColors;
