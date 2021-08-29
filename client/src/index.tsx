import React from "react";
import ReactDOM from "react-dom";
import "./index.css";

import { AppWithRouter } from "./routes";

ReactDOM.render(
  <React.StrictMode>
    <AppWithRouter />
  </React.StrictMode>,
  document.getElementById("root")
);
