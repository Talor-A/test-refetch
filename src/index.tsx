import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App, { TodoContext } from "./App";
import reportWebVitals from "./reportWebVitals";

const ShowHide = ({ children }: React.PropsWithChildren<{}>) => {
  const [show, setShow] = React.useState(false);

  if (!show) return <button onClick={() => setShow(true)}>Show</button>;
  return <>{children}</>;
};
const Wrapper = ({ children }: React.PropsWithChildren<{}>) => {
  return (
    <div
      style={{
        display: "flex",
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
      }}
    >
      {children}
    </div>
  );
};
ReactDOM.render(
  <React.StrictMode>
    <TodoContext.Provider value="1">
      <Wrapper>
        <ShowHide>
          <App />
        </ShowHide>
      </Wrapper>
    </TodoContext.Provider>
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
