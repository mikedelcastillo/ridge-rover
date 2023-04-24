import { configureStore } from "@reduxjs/toolkit"
import { WebSocketStoreState, websocketSlice } from "./websocket"
import { BoardStoreState, boardSlice } from "./board"

export type StoreState = {
  websocket: WebSocketStoreState,
  board: BoardStoreState,
}

export const store = configureStore<StoreState>({
    reducer: {
        websocket: websocketSlice.reducer,
        board: boardSlice.reducer,
    }
})
