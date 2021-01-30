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
const mockNetworkResponse = (json: any, requestInit?: ResponseInit) => {
  (window.fetch as jest.MockedFunction<
    typeof window.fetch
  >).mockImplementationOnce(
    async () => new Response(JSON.stringify(json), requestInit)
  );
};
const render = (data: React.ReactElement) =>
  _render(<TodoContext.Provider value="1">{data}</TodoContext.Provider>);
beforeAll(() => jest.spyOn(window, "fetch"));

const getLoading = () => screen.getByText(/loading/i);
const getNetworkError = () => screen.getByText(/network error/i);
const getHttpError = () => screen.getByText(/code 501/i);
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
  expect(getNetworkError()).toBeInTheDocument();
});
test("renders http status error", async () => {
  mockNetworkResponse(
    {},
    {
      status: 501,
      statusText: "internal server error",
    }
  );
  render(<App />);
  expect(getLoading()).toBeInTheDocument();
  await waitForElementToBeRemoved(getLoading);
  expect(getHttpError()).toBeInTheDocument();
});
test("renders result", async () => {
  mockNetworkResponse({
    userId: 1,
    id: 1,
    title: "todo title",
    completed: false,
  });
  render(<App />);
  expect(getLoading()).toBeInTheDocument();
  await waitForElementToBeRemoved(getLoading);
  expect(getTodo()).toBeInTheDocument();
});
