import React from "react"
import ReactDOM from "react-dom/client"
import App from "./App"
import "./index.css"

import EthereumProvider from "./EthereumContext"

ReactDOM.createRoot(document.getElementById("root")).render(
  <EthereumProvider>
    <App />
  </EthereumProvider>
)
