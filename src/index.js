import React from "react";
import ReactDOM from "react-dom/client";
import "./App.css"; // Garante que o CSS está sendo carregado
import App from "./App";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
