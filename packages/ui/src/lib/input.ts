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
    const speed = 0.1

    if(KEYBOARD_INPUTS["KeyA"]) steerTarget--
    if(KEYBOARD_INPUTS["KeyD"]) steerTarget++
    if(KEYBOARD_INPUTS["KeyW"]) throttleTarget += speed
    if(KEYBOARD_INPUTS["KeyS"]) throttleTarget -= speed

    const gamepads = navigator.getGamepads()
    
    for(const gamepad of gamepads){
        if(gamepad?.id === "Xbox 360 Controller (XInput STANDARD GAMEPAD)"){
            const leftBumper = gamepad.buttons[6].value
            const rightBumper = gamepad.buttons[7].value
            const throttleMix = rightBumper - leftBumper
            throttleTarget += throttleMix
            steerTarget += gamepad.axes[0]
        }
    }

    sendMove(steerTarget, throttleTarget)
    requestAnimationFrame(loop)
}