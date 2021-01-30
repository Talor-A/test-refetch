import React from "react";
import { render, screen } from "@testing-library/react";
import App from "./App";

test("renders learn react link", () => {
  render(<App />);
  const loading = screen.getByText(/loading/i);
  expect(loading).toBeInTheDocument();
});
