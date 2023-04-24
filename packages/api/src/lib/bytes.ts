import { BYTE_ZERO, COMMS_FLOAT_BYTE_COUNT, COMMS_FLOAT_NEG_BYTE, COMMS_FLOAT_POS_BYTE, COMMS_FLOAT_ZERO_BYTE } from "../constants"

export const byteToRange = (byte: string) => {
    const charCode = byte.charCodeAt(0)
    if(charCode === COMMS_FLOAT_ZERO_BYTE) return 0
    if(charCode >= COMMS_FLOAT_NEG_BYTE && charCode < COMMS_FLOAT_NEG_BYTE + COMMS_FLOAT_BYTE_COUNT)
        return (charCode - COMMS_FLOAT_NEG_BYTE) / COMMS_FLOAT_BYTE_COUNT
    if(charCode >= COMMS_FLOAT_POS_BYTE && charCode < COMMS_FLOAT_POS_BYTE + COMMS_FLOAT_BYTE_COUNT)
        return -(charCode - COMMS_FLOAT_POS_BYTE) / COMMS_FLOAT_BYTE_COUNT
    return 0
}

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

export const parseLine = (line: string) => {
    const steerState = line[0]
    const currentSteer = byteToRange(line[1] || BYTE_ZERO)
    const targetSteer = byteToRange(line[1] || BYTE_ZERO)

    return {
        steerState, currentSteer, targetSteer,
    }
}

