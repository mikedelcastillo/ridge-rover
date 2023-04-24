import { SerialPort, ReadlineParser } from "serialport"

export const board = new SerialPort({
    path: "/dev/ttyACM0",
    baudRate: 115200,
    autoOpen: false,
})

board.on("error", (error) => {
    console.error(error)
    process.exit()
})

board.on("close", () => {
    console.warn("Board closed")
    process.exit()
})