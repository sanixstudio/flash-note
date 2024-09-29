import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import { Toaster } from "./components/ui/toaster";
import "./app.css";

ReactDOM.render(
  <React.StrictMode>
    <App />
    <Toaster />
  </React.StrictMode>,
  document.getElementById("root")
);
