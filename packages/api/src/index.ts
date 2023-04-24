import { WebSocketServer } from "ws"
import { BYTE_PING, DEFAULT_PORT } from "./constants"
import { board } from "./serial"

const wss = new WebSocketServer({ port: DEFAULT_PORT })

wss.on("connection", (ws) => {
    ws.on("message", (binary) => {
        const data = binary.toString()
        if(data === BYTE_PING) ws.send(BYTE_PING)

    })
})