import { store } from "../store"
import { WebSocketStatus, websocketSlice } from "../store/websocket"
import {DEFAULT_PORT, BYTE_PING} from "@ridge-rover/api/src/constants.ts"

export let ws: WebSocket | undefined

let pingInterval: NodeJS.Timer | undefined

export const connectWebSocket = () => {
    const state = store.getState()
    if(state.websocket.status !== WebSocketStatus.DISCONNECTED) return
    store.dispatch(websocketSlice.actions.setStatus(
        WebSocketStatus.CONNECTING
    ))

    ws = new WebSocket(`ws://${state.websocket.ip}:${DEFAULT_PORT}`)
    ws.addEventListener("open", () => {
        if(typeof pingInterval === "undefined"){
            pingInterval = setInterval(sendPing, 1000 / 4)
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
    if(state.websocket.status !== WebSocketStatus.CONNECTED) return false
    if(typeof ws === "undefined") return false
    if(ws.readyState !== WebSocket.OPEN) return false
    return true
}

export const sendPing = () => {
    if(!isWsReady()) return
    ws?.send(BYTE_PING)
    const now = Date.now()
    store.dispatch(websocketSlice.actions.setLastPing(now))
}

export const handleMessage = (data: string) => {
    const state = store.getState()
    if(data === BYTE_PING){
        const now = Date.now()
        store.dispatch(websocketSlice.actions.setPing(now -
            state.websocket.lastPing))
    }
}