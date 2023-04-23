import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)

const { hostname, hash } = window.location
const wsUrl = `ws://${hash.substring(1) || hostname}:5000`

window.addEventListener("mousemove", (event) => {
  const curX = event.pageX
  const w = window.innerWidth / 2
  const value = (curX - w) / w
  ws.send(value.toFixed(2))
})

const ws = new WebSocket(wsUrl)
console.log("connecting...", wsUrl)
ws.addEventListener("open", () => {
  console.log("connected!")
})