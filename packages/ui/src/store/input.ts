import { PayloadAction, createSlice } from "@reduxjs/toolkit"

export type InputStoreState = {
    steerTarget: number,
    throttleTarget: number,
}

const initialState: InputStoreState = {
    steerTarget: 0,
    throttleTarget: 0,
}

export const inputSlice = createSlice({
    name: "input",
    initialState,
    reducers: {
        setState: (state, action: PayloadAction<InputStoreState>) => {
            state.steerTarget = action.payload.steerTarget
            state.throttleTarget = action.payload.throttleTarget
        },
    },
})