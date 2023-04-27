import { PayloadAction, createSlice } from "@reduxjs/toolkit"
import { WHEEL_ENCODER_SAMPLING_DURATION_MS } from "@ridge-rover/api/src/constants"
import { MAX_KPH, MOTOR_MAX_RPM } from "../lib/speed"
import { useSelector } from "react-redux"
import { StoreState } from "."

type Stat = {
    title: string,
    stringify: (value: number) => string,
    min: number, max: number, capacity: number,
}

const motionCapacity = 60 * 5

export const STATS = {
    speed: {
        title: "Speed",
        stringify: n => `${n.toFixed(2)}km/h`,
        min: 0, max: MAX_KPH, capacity: Math.round(1000 / WHEEL_ENCODER_SAMPLING_DURATION_MS) * 5,
    },
    motorRpm: {
        title: "Motor RPM",
        stringify: n => `${Math.round(n)}RPM`,
        min: 0, max: MOTOR_MAX_RPM, capacity: Math.round(1000 / WHEEL_ENCODER_SAMPLING_DURATION_MS) * 5,
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
    ping: {
        title: "Ping",
        stringify: n => `${Math.round(n)}ms`,
        min: 0, max: 20, capacity: 10 * 10,
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

export const useStatValue = (id: keyof typeof STATS) => {
    const state = useSelector((state: StoreState) => state.stats)
    return state[id]?.[state[id].length - 1] || STATS[id].min
}