import { WebSocketServer } from "ws"
import { DEFAULT_PORT } from "./constants"

const wss = new WebSocketServer({ port: DEFAULT_PORT })

import { SerialPort, ReadlineParser } from "serialport"
import { rangeToByte } from "./helpers"

const port = new SerialPort({
    path: "/dev/ttyACM0",
    baudRate: 115200,
})

const parser = new ReadlineParser()
port.pipe(parser)

parser.on("data", (data) => {
    // console.log(data)
})

wss.on("connection", (ws) => {
    ws.on("message", (data) => {
        const input = Number(data.toString())
        const char = rangeToByte(input)
        console.log(input, char)
        port.write(char)
    })
})

