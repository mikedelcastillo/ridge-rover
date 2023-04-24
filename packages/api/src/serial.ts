import { SerialPort, ReadlineParser } from "serialport"

export const board = new SerialPort({
    path: "/dev/ttyACM0",
    baudRate: 115200,
})

board.on("error", (error) => {
    console.error(error)
    process.exit()
})

board.on("close", () => {
    console.warn("Board closed")
    process.exit()
})

// const parser = new ReadlineParser()
// port.pipe(parser)

// // parser.on("data", (data) => {
// //     // console.log(data)
// // })

// setTimeout(() => {
//     setInterval(() => {
//         const input = Math.sin(Date.now() / 1000 * 5)
//         const char = rangeToByte(input)
//         console.log(input, char)
//         port.write(char)
//     }, 20)
// }, 5000)

