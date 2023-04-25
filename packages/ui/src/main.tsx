import React from "react"
import ReactDOM from "react-dom/client"
import App from "./App.tsx"
import "./index.sass"
import { store } from "./store"
import { Provider } from "react-redux"
import { startInputLoop } from "./lib/input.ts"

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
    <React.StrictMode>
        <Provider store={store}>
            <App />
        </Provider>
    </React.StrictMode>,
)

window.addEventListener("DOMContentLoaded", () => {
    startInputLoop()
})