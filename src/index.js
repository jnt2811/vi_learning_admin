import React from "react";
import ReactDOM from "react-dom/client";
import reportWebVitals from "./reportWebVitals";
import { AppConfig } from "./configs";
import { AppRouter } from "./router";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <AppConfig>
    <AppRouter />
  </AppConfig>
);

reportWebVitals();
