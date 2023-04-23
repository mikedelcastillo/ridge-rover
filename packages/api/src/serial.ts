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

setTimeout(() => {
    setInterval(() => {
        const input = Math.sin(Date.now() / 1000 * 5)
        const char = rangeToByte(input)
        console.log(input, char)
        port.write(char)
    }, 20)
}, 5000)

