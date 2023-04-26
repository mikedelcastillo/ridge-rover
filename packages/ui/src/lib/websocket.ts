import { store } from "../store"
import { boardSlice } from "../store/board"
import { statsSlice } from "../store/stats"
import { WebSocketStatus, websocketSlice } from "../store/websocket"
import { DEFAULT_PORT, BYTE_PING, BYTE_BOARD_TX, BYTE_OS } from "@ridge-rover/api/src/constants.ts"
import { byteToRange, formatMove, parseBoardSerial } from "@ridge-rover/api/src/lib/bytes"

export let ws: WebSocket | undefined

let pingInterval: NodeJS.Timer | undefined

export const connectWebSocket = () => {
    const state = store.getState()
    if (state.websocket.status !== WebSocketStatus.DISCONNECTED) return
    store.dispatch(websocketSlice.actions.setStatus(
        WebSocketStatus.CONNECTING
    ))

    ws = new WebSocket(`ws://${state.websocket.ip}:${DEFAULT_PORT}`)
    ws.addEventListener("open", () => {
        if (typeof pingInterval === "undefined") {
            pingInterval = setInterval(sendPing, 1000 / 10)
        }
        store.dispatch(websocketSlice.actions.setStatus(
            WebSocketStatus.CONNECTED
        ))
    })
    ws.addEventListener("close", () => {
        store.dispatch(websocketSlice.actions.setStatus(
            WebSocketStatus.DISCONNECTED
        ))
        ws = undefined
    })
    ws.addEventListener("error", (event) => {
        console.error(event)
    })
    ws.addEventListener("message", (event) => {
        handleMessage(event.data)
    })
}

export const isWsReady = () => {
    const state = store.getState()
    if (state.websocket.status !== WebSocketStatus.CONNECTED) return false
    if (typeof ws === "undefined") return false
    if (ws.readyState !== WebSocket.OPEN) return false
    return true
}

export const sendPing = () => {
    if (!isWsReady()) return
    ws?.send(BYTE_PING)
    const now = Date.now()
    store.dispatch(websocketSlice.actions.setLastPing(now))
}

export const handleMessage = (data: string) => {
    const state = store.getState()
    if (data === BYTE_PING) {
        const now = Date.now()
        const ping = now - state.websocket.lastPing
        store.dispatch(websocketSlice.actions.setPing(ping))
        store.dispatch(statsSlice.actions.log({ id: "ping", value: ping }))
    }

    if (data.startsWith(BYTE_BOARD_TX)) {
        const boardState = parseBoardSerial(data)
        store.dispatch(boardSlice.actions.setState(boardState))
    }

    if (data.startsWith(BYTE_OS)) {
        const cpu = byteToRange(data[1])
        const mem = byteToRange(data[2])
        store.dispatch(statsSlice.actions.log({ id: "cpu", value: cpu }))
        store.dispatch(statsSlice.actions.log({ id: "ram", value: mem }))
    }
}

export const sendMove = (...params: Parameters<typeof formatMove>) => {
    if (!isWsReady()) return
    const message = formatMove(...params)
    ws?.send(message)
}