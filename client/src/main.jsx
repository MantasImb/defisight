import React from "react"
import ReactDOM from "react-dom/client"
import App from "./App"
import "./index.css"

import APIProvider from "./contexts/APIProvider"
import { StateProvider } from "./contexts/StateProvider"

ReactDOM.createRoot(document.getElementById("root")).render(
  <StateProvider>
    <APIProvider>
      <App />
    </APIProvider>
  </StateProvider>
)
