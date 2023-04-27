export const DEFAULT_PORT = 5000

export const COMMS_FLOAT_BYTE_COUNT = 26 // a to z
export const COMMS_FLOAT_ZERO_BYTE = 48 // 0
export const BYTE_ZERO = String.fromCharCode(COMMS_FLOAT_ZERO_BYTE)
export const COMMS_FLOAT_NEG_BYTE = 97 // "a"
export const COMMS_FLOAT_POS_BYTE = 65 // "A"

export const STEERING_STATE_CALIBRATE_BYTE = "C"
export const STEERING_STATE_NORMAL_BYTE = "N"

export const BYTE_PING = "."
export const BYTE_MOVE = "~"
export const BYTE_BOARD_TX = "%"
export const BYTE_OS = "*"

export const WHEEL_ENCODER_SAMPLING_DURATION_MS = 20
