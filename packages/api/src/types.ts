import { STEERING_STATE_CALIBRATE_BYTE, STEERING_STATE_NORMAL_BYTE } from "./constants"

export enum SteeringState {
    CALIBRATE = STEERING_STATE_CALIBRATE_BYTE,
    NORMAL = STEERING_STATE_NORMAL_BYTE,
}

export type BoardState = {
    steerState: SteeringState, 
    currentSteer: number, 
    targetSteer: number,
    targetThrottle: number,
}