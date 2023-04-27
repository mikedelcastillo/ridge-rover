import { store } from "../store"
import { statsSlice } from "../store/stats"

const WHEEL_DIAMETER_MM = 80
const WHEEL_CIRCUMFERENCE = (Math.PI * WHEEL_DIAMETER_MM)
const WHEEL_CIRCUMFERENCE_METER = WHEEL_CIRCUMFERENCE / 1000
const WHEEL_CIRCUMFERENCE_KM = WHEEL_CIRCUMFERENCE_METER / 1000
const WHEEL_SPOKES = 6
export const MAX_KPH = 80

const WHEEL_PULLEY_TEETH = 64
const MOTOR_PULLEY_TEETH = 16
export const MOTOR_MAX_RPM = 22000

export const getKph = () => {
    const state = store.getState()
    const tps = state.board.state.wheelTps / WHEEL_SPOKES
    const rpm = tps * 60
    const rotationsPerHour = rpm * 60
    const kph = rotationsPerHour * WHEEL_CIRCUMFERENCE_KM
    return kph
}

export const getMotorRpm = () => {
    const state = store.getState()
    const tps = state.board.state.wheelTps / WHEEL_SPOKES
    const rpm = tps * 60
    const motorRpm = rpm * (WHEEL_PULLEY_TEETH / MOTOR_PULLEY_TEETH)
    return motorRpm
}

export const logSpeed = () => {
    store.dispatch(statsSlice.actions.log({
        id: "speed", value: getKph(),
    }))
    store.dispatch(statsSlice.actions.log({
        id: "motorRpm", value: getMotorRpm(),
    }))
}