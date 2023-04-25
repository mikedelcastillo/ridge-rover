import { WebSocketServer } from "ws"
import osu, { mem } from "node-os-utils"
import { BYTE_BOARD_TX, BYTE_MOVE, BYTE_OS, BYTE_PING, DEFAULT_PORT } from "./constants"
import { board, boardParser } from "./serial"
import { rangeToByte } from "./lib/bytes"

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
            const data = binary.toString().trim()
            if (data === BYTE_PING) ws.send(BYTE_PING)
            if (data.startsWith(BYTE_MOVE)) board.write(data)
        })
    })

    boardParser.on("data", (line: string) => {
        for (const ws of wss.clients) {
            ws.send(BYTE_BOARD_TX + line)
        }
    })

    setInterval(async () => {
        const cpuPercent = (await osu.cpu.usage()) / 100
        const memUsage = (await mem.info()).usedMemPercentage / 100
        const message = [
            BYTE_OS,
            rangeToByte(cpuPercent),
            rangeToByte(memUsage),
        ].join("")
        for (const ws of wss.clients) {
            ws.send(message)
        }
    }, 500)
})
