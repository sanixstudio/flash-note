import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import { Toaster } from "./components/ui/toaster";
import "./app.css";

// Suppress known React 18 compatibility warnings from third-party libraries
const originalError = console.error;
const originalWarn = console.warn;

console.error = (...args) => {
  if (
    typeof args[0] === 'string' &&
    (args[0].includes('Support for defaultProps will be removed from memo components') ||
     args[0].includes('ReactDOM.render is no longer supported') ||
     args[0].includes('React does not recognize the') ||
     args[0].includes('prop on a DOM element'))
  ) {
    return;
  }
  originalError.call(console, ...args);
};

console.warn = (...args) => {
  if (
    typeof args[0] === 'string' &&
    (args[0].includes('Support for defaultProps will be removed from memo components') ||
     args[0].includes('ReactDOM.render is no longer supported') ||
     args[0].includes('React does not recognize the') ||
     args[0].includes('prop on a DOM element'))
  ) {
    return;
  }
  originalWarn.call(console, ...args);
};

const container = document.getElementById("root");
if (!container) {
  throw new Error("Root element not found");
}

const root = createRoot(container);
root.render(
  <React.StrictMode>
    <App />
    <Toaster />
  </React.StrictMode>
);
