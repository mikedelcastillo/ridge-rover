import { WebSocketServer } from "ws"
import { BYTE_BOARD_TX, BYTE_PING, DEFAULT_PORT } from "./constants"
import { board, boardParser } from "./serial"
import { parseBoardSerial } from "./lib/bytes"

console.log("Connecting to board...")
board.open((error) => {
    if (error) {
        console.log("Could not connect to board")
        process.exit()
    }

    const wss = new WebSocketServer({ port: DEFAULT_PORT })
    console.log(`Started websocket server in port ${DEFAULT_PORT}`)

    wss.on("connection", (ws) => {
        ws.on("message", (binary) => {
            const data = binary.toString()
            if (data === BYTE_PING) ws.send(BYTE_PING)

        })
    })

    boardParser.on("data", (line: string) => {
        for (const ws of wss.clients) {
            ws.send(BYTE_BOARD_TX + line)
        }
    })
})
