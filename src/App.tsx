import React from "react";

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

type QueryWithLoading<T, E = Error> = QueryResult<T, E> | { status: "loading" };

/**
 * React Hook. reads the current todo id from context and returns its data.
 */
const useCurrentTodo = () => {
  const currentTodo = React.useContext(TodoContext);

  const refetch = React.useCallback(
    () => loadTodos(currentTodo).then((res) => setState(res)),
    [currentTodo]
  );

  const [state, setState] = React.useState<
    QueryWithLoading<TodosResponse, FetchError>
  >({ status: "loading" });

  React.useEffect(() => {
    refetch();
  }, [refetch]);
  return [state, refetch] as const;
};

const MyFavoriteColors = () => {
  const [result] = useCurrentTodo();

  if (result.status === "loading") return <div>Loading</div>;
  if (result.status === "error") {
    if (result.error.kind === "network-error")
      return <div>network error occurred. try refreshing.</div>;
    return <div>HTTP error code {result.error.code}</div>;
  }
  return <div>{result.result.title}</div>;
};

export default MyFavoriteColors;
