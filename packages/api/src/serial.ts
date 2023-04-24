import { SerialPort, ReadlineParser } from "serialport"

export const board = new SerialPort({
    path: "/dev/ttyACM0",
    baudRate: 115200,
    autoOpen: false,
})

export const boardParser = new ReadlineParser()
board.pipe(boardParser)