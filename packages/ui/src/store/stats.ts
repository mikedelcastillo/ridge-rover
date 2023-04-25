import { PayloadAction, createSlice } from "@reduxjs/toolkit"

type Stat = {
    title: string,
    stringify: (value: number) => string,
    min?: number, max?: number, capacity: number,
}

const STATS = {
    steer: {
        title: "Steer",
        stringify: n => `${Math.round(n * 45)}°`,
        min: -1, max: 1, capacity: 60 * 20,
    },
    steerResistance: {
        title: "Resistance",
        stringify: n => `${Math.round(n * 45)}°`,
        min: -1, max: 1, capacity: 60 * 20,
    },
    throttle: {
        title: "Throttle",
        stringify: n => `${Math.abs(Math.round(n * 100))}%`,
        min: -1, max: 1, capacity: 60 * 20,
    },
    cpu: {
        title: "CPU",
        stringify: n => `${Math.round(n)}%`,
        min: 0, max: 100, capacity: 30,
    },
    ram: {
        title: "RAM",
        stringify: n => `${n.toFixed(2)}GB`,
        min: 0, capacity: 30,
    },
} satisfies Record<string, Stat>

export type StatsStoreState = Record<keyof typeof STATS, number[]>

const initialState: StatsStoreState = (() => {
    const output = {} as StatsStoreState
    for (const key in STATS) output[key as keyof typeof STATS] = []
    return output
})()

export const statsSlice = createSlice({
    name: "stats",
    initialState,
    reducers: {
        log: (state, action: PayloadAction<{
            id: keyof typeof STATS,
            value: number,
        }>) => {
            const { id, value } = action.payload
            state[id].push(value)
            if (state[id].length === STATS[id].capacity)
                state[id].shift()
        },
    },
})