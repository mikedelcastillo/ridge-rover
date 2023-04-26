import { store } from "../store"
import { MAX_GEARS, inputSlice } from "../store/input"
import { statsSlice } from "../store/stats"
import { sendMove } from "./websocket"

const KEYBOARD_INPUTS: Record<string, undefined | boolean> = {}
const VIRTUAL_BUTTONS: Record<string, [boolean, boolean]> = {
    GEAR_UP: [false, false],
    GEAR_DOWN: [false, false],
}

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
    const state = store.getState()
    let steerTarget = 0
    let throttleTarget = 0
    let gear = state.input.gear

    VIRTUAL_BUTTONS.GEAR_UP[1] = VIRTUAL_BUTTONS.GEAR_UP[0]
    VIRTUAL_BUTTONS.GEAR_DOWN[1] = VIRTUAL_BUTTONS.GEAR_DOWN[0]

    if (KEYBOARD_INPUTS["KeyA"]) steerTarget--
    if (KEYBOARD_INPUTS["KeyD"]) steerTarget++
    if (KEYBOARD_INPUTS["KeyW"]) throttleTarget += 1
    if (KEYBOARD_INPUTS["KeyS"]) throttleTarget -= 1

    const gamepads = navigator.getGamepads()

    for (const gamepad of gamepads) {
        if (gamepad?.id === "Xbox 360 Controller (XInput STANDARD GAMEPAD)") {
            const leftTrigger = gamepad.buttons[6].value || 0
            const rightTrigger = gamepad.buttons[7].value || 0
            const leftStickXAxis = gamepad.axes[0] || 0
            const leftBumper = gamepad.buttons[4].value || 0
            const rightBumper = gamepad.buttons[5].value || 0

            VIRTUAL_BUTTONS.GEAR_DOWN[0] = leftBumper > 0
            VIRTUAL_BUTTONS.GEAR_UP[0] = rightBumper > 0

            const throttleMix = rightTrigger - leftTrigger
            throttleTarget += Math.sign(throttleMix) * Math.pow(throttleMix, 2)
            steerTarget += Math.sign(leftStickXAxis) * Math.pow(leftStickXAxis, 2)
        }
    }

    if ((!VIRTUAL_BUTTONS.GEAR_DOWN[0] && VIRTUAL_BUTTONS.GEAR_DOWN[1])) {
        gear = Math.max(1, gear - 1)
    }

    if ((!VIRTUAL_BUTTONS.GEAR_UP[0] && VIRTUAL_BUTTONS.GEAR_UP[1])) {
        gear = Math.min(MAX_GEARS, gear + 1)
    }

    throttleTarget *= Math.pow(state.input.gear / MAX_GEARS, 1.4)

    store.dispatch(statsSlice.actions.log({ id: "steer", value: steerTarget }))
    store.dispatch(statsSlice.actions.log({ id: "steerResistance", value: steerTarget - state.board.state.currentSteer }))
    store.dispatch(statsSlice.actions.log({ id: "actualSteer", value: state.board.state.currentSteer }))
    store.dispatch(statsSlice.actions.log({ id: "throttle", value: throttleTarget }))
    store.dispatch(inputSlice.actions.setMove({ steerTarget, throttleTarget }))
    store.dispatch(inputSlice.actions.setGear(gear))
    sendMove(steerTarget, throttleTarget)
    requestAnimationFrame(loop)
}