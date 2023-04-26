import { PayloadAction, createSlice } from "@reduxjs/toolkit"

export const MAX_GEARS = 6

export type MoveInput = {
    steerTarget: number,
    throttleTarget: number,
}

export type InputStoreState = MoveInput & {
    gear: number,
}

const initialState: InputStoreState = {
    steerTarget: 0,
    throttleTarget: 0,
    gear: 1,
}

export const inputSlice = createSlice({
    name: "input",
    initialState,
    reducers: {
        setMove: (state, action: PayloadAction<MoveInput>) => {
            state.steerTarget = action.payload.steerTarget
            state.throttleTarget = action.payload.throttleTarget
        },
        setGear: (state, action: PayloadAction<InputStoreState["gear"]>) => {
            state.gear = action.payload
        },
    },
})