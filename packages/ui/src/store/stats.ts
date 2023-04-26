import { PayloadAction, createSlice } from "@reduxjs/toolkit"

type Stat = {
    title: string,
    stringify: (value: number) => string,
    min: number, max: number, capacity: number,
}

const motionCapacity = 60 * 5

export const STATS = {
    ping: {
        title: "Ping",
        stringify: n => `${Math.round(n)}ms`,
        min: 0, max: 20, capacity: 10 * 10,
    },
    throttle: {
        title: "Input Throttle",
        stringify: n => `${Math.abs(Math.round(n * 100))}%`,
        min: -1, max: 1, capacity: motionCapacity,
    },
    steer: {
        title: "Input Steer",
        stringify: n => `${Math.round(n * 45)}°`,
        min: -1, max: 1, capacity: motionCapacity,
    },
    actualSteer: {
        title: "Current Steer",
        stringify: n => `${Math.round(n * 45)}°`,
        min: -1, max: 1, capacity: motionCapacity,
    },
    steerResistance: {
        title: "Steer Resistance",
        stringify: n => `${Math.round(n * 45)}°`,
        min: -1, max: 1, capacity: motionCapacity,
    },
    cpu: {
        title: "CPU",
        stringify: n => `${Math.round(n * 100)}%`,
        min: 0, max: 1, capacity: 2 * 5,
    },
    ram: {
        title: "RAM",
        stringify: n => `${Math.round(n * 100)}%`,
        min: 0, max: 1, capacity: 2 * 5,
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