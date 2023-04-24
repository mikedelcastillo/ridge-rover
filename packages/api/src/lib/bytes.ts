import { COMMS_FLOAT_BYTE_COUNT, COMMS_FLOAT_NEG_BYTE, COMMS_FLOAT_POS_BYTE } from "../constants"

export const rangeToByte = (range: number): string => {
    range = Math.max(-1, Math.min(1, range))
    const sign = Math.sign(range)
    const index = Math.round(Math.abs(range) * (COMMS_FLOAT_BYTE_COUNT))
    if(index !== 0){
        const offset = sign > 0 ?COMMS_FLOAT_POS_BYTE : COMMS_FLOAT_NEG_BYTE
        return String.fromCharCode(offset + index - 1)
    }
    return "0"
}

export const parseMove = (data: string) => {
    const steerByte = data[1]
    const throttleByte = data[2]
}