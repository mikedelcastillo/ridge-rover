import { configureStore } from "@reduxjs/toolkit"
import { WebSocketState, websocketSlice } from "./websocket"

export type StoreState = {
  websocket: WebSocketState,
}

export const store = configureStore<StoreState>({
    reducer: {
        websocket: websocketSlice.reducer,
    }
})
