import { WebSocketServer } from "ws"
import { DEFAULT_PORT } from "./constants"

const wss = new WebSocketServer({ port: DEFAULT_PORT })

wss.on("connection", (ws) => {
    ws.on("message", (data) => {
        console.log(data)
    })
})