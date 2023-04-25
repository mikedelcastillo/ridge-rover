import { store } from "../store"
import { inputSlice } from "../store/input"
import { statsSlice } from "../store/stats"
import { sendMove } from "./websocket"

const KEYBOARD_INPUTS: Record<string, undefined | boolean> = {}

export const startInputLoop = () => {
    window.addEventListener("keydown", e => {
        KEYBOARD_INPUTS[e.code] = true
    })
    window.addEventListener("keyup", e => {
        KEYBOARD_INPUTS[e.code] = false
    })

    loop()
}


const loop = () => {
    let steerTarget = 0
    let throttleTarget = 0
    const keyboardSpeed = 0.1

    if (KEYBOARD_INPUTS["KeyA"]) steerTarget--
    if (KEYBOARD_INPUTS["KeyD"]) steerTarget++
    if (KEYBOARD_INPUTS["KeyW"]) throttleTarget += keyboardSpeed
    if (KEYBOARD_INPUTS["KeyS"]) throttleTarget -= keyboardSpeed

    const gamepads = navigator.getGamepads()

    for (const gamepad of gamepads) {
        if (gamepad?.id === "Xbox 360 Controller (XInput STANDARD GAMEPAD)") {
            const leftBumper = gamepad.buttons[6].value || 0
            const rightBumper = gamepad.buttons[7].value || 0
            const throttleMix = rightBumper - leftBumper
            const leftStickXAxis = gamepad.axes[0] || 0
            throttleTarget += Math.sign(throttleMix) * Math.pow(throttleMix, 2)
            steerTarget += Math.sign(leftStickXAxis) * Math.pow(leftStickXAxis, 2)
        }
    }

    store.dispatch(statsSlice.actions.log({ id: "steer", value: steerTarget }))
    store.dispatch(statsSlice.actions.log({ id: "steerResistance", value: steerTarget - store.getState().board.state.currentSteer }))
    store.dispatch(statsSlice.actions.log({ id: "actualSteer", value: store.getState().board.state.currentSteer }))
    store.dispatch(statsSlice.actions.log({ id: "throttle", value: throttleTarget }))
    store.dispatch(inputSlice.actions.setState({ steerTarget, throttleTarget }))
    sendMove(steerTarget, throttleTarget)
    requestAnimationFrame(loop)
}