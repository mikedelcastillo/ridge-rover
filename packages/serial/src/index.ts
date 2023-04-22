import { SerialPort, ReadlineParser } from "serialport"

const port = new SerialPort({
    path: "/dev/ttyACM0",
    baudRate: 115200,
})

const parser = new ReadlineParser()
port.pipe(parser)

parser.on("data", (data) => {
    console.log(data)
})