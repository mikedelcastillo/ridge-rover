import { PayloadAction, createSlice } from "@reduxjs/toolkit"

export enum WebSocketStatus {
    DISCONNECTED = "DISCONNECTED",
    CONNECTING = "CONNECTING",
    CONNECTED = "CONNECTED",
}

export type WebSocketStoreState = {
    status: WebSocketStatus,
    ip: string,
    ping: number,
    lastPing: number,
}

const { hostname, hash } = window.location

const initialState: WebSocketStoreState = {
    status: WebSocketStatus.DISCONNECTED,
    ip: hash.substring(1) || hostname,
    ping: 0,
    lastPing: Date.now(),
}

export const websocketSlice = createSlice({
    name: "websocket",
    initialState,
    reducers: {
        setStatus: (state, action: PayloadAction<WebSocketStoreState["status"]>) => { state.status = action.payload },
        setIp: (state, action: PayloadAction<WebSocketStoreState["ip"]>) => { state.ip = action.payload },
        setPing: (state, action: PayloadAction<WebSocketStoreState["ping"]>) => { state.ping = action.payload },
        setLastPing: (state, action: PayloadAction<WebSocketStoreState["lastPing"]>) => { state.lastPing = action.payload },
    },
})