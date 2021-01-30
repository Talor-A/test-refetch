import React from "react";
import {
  render as _render,
  screen,
  waitForElementToBeRemoved,
} from "@testing-library/react";
import App, { TodoContext } from "./App";
const mockNetworkError = () => {
  (window.fetch as jest.MockedFunction<
    typeof window.fetch
  >).mockImplementationOnce(() => {
    throw TypeError("failed to fetch");
  });
};
const mockNetworkSuccess = () => {
  (window.fetch as jest.MockedFunction<
    typeof window.fetch
  >).mockImplementationOnce(
    async () =>
      new Response(
        JSON.stringify({
          userId: 1,
          id: 1,
          title: "todo title",
          completed: false,
        })
      )
  );
};
const render = (data: React.ReactElement) =>
  _render(<TodoContext.Provider value="1">{data}</TodoContext.Provider>);
beforeAll(() => jest.spyOn(window, "fetch"));

const getLoading = () => screen.getByText(/loading/i);
const getError = () => screen.getByText(/network error/i);
const getTodo = () => screen.getByText(/todo title/i);

test("renders learn react link", () => {
  render(<App />);
  expect(getLoading()).toBeInTheDocument();
});

test("renders network error", async () => {
  mockNetworkError();
  render(<App />);
  expect(getLoading()).toBeInTheDocument();
  await waitForElementToBeRemoved(getLoading);
  expect(getError()).toBeInTheDocument();
});
test("renders result", async () => {
  mockNetworkSuccess();
  render(<App />);
  expect(getLoading()).toBeInTheDocument();
  await waitForElementToBeRemoved(getLoading);
  expect(getTodo()).toBeInTheDocument();
});
