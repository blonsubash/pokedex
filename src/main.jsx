import React from "react";
import ReactDOM from "react-dom/client";
import { Toaster } from "react-hot-toast";

import "./index.css";

import App from "./App.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <div>
    <App />
    <div id="globalLoader">Loading Application ...</div>
    <Toaster
      position="top-center"
      reverseOrder={false}
      toastOptions={{
        className: "custom-toast",
        duration: 2000,
      }}
    />
  </div>
);
