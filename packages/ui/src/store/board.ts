import { PayloadAction, createSlice } from "@reduxjs/toolkit"
import { BoardState, SteeringState } from "@ridge-rover/api/src/types"

export type BoardStoreState = {
    state: BoardState,
}

const initialState: BoardStoreState = {
    state: {
        steerState: SteeringState.CALIBRATE,
        currentSteer: 0,
        targetSteer: 0,
        targetThrottle: 0,
    },
}

export const boardSlice = createSlice({
    name: "board",
    initialState,
    reducers: {
        setState: (state, action: PayloadAction<BoardStoreState["state"]>) => { state.state = action.payload },
    },
})