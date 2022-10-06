import React from "react"
import ReactDOM from "react-dom/client"
import App from "./App"
import "./index.css"

import APIProvider from "./APIContext"

ReactDOM.createRoot(document.getElementById("root")).render(
  <APIProvider>
    <App />
  </APIProvider>
)
