import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)

const { hostname } = window.location
const wsUrl = `ws://${hostname}:5000`

const ws = new WebSocket(wsUrl)
console.log("connecting...")
ws.addEventListener("open", () => {
  console.log("connected!")
})