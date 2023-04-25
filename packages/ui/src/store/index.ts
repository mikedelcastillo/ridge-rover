import { configureStore } from "@reduxjs/toolkit"
import { WebSocketStoreState, websocketSlice } from "./websocket"
import { BoardStoreState, boardSlice } from "./board"
import { InputStoreState, inputSlice } from "./input"
import { StatsStoreState, statsSlice } from "./stats"

export type StoreState = {
  websocket: WebSocketStoreState,
  board: BoardStoreState,
  input: InputStoreState,
  stats: StatsStoreState,
}

export const store = configureStore<StoreState>({
    reducer: {
        websocket: websocketSlice.reducer,
        board: boardSlice.reducer,
        input: inputSlice.reducer,
        stats: statsSlice.reducer,
    }
})
