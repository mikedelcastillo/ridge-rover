import { COMMS_FLOAT_BYTE_COUNT, COMMS_FLOAT_NEG_BYTE, COMMS_FLOAT_POS_BYTE } from "./constants"

export const rangeToByte = (range: number): string => {
    range = Math.max(-1, Math.min(1, range))
    const sign = Math.sign(range)
    const index = Math.round(Math.abs(range) * (COMMS_FLOAT_BYTE_COUNT - 1))
    if(index !== 0){
        return String.fromCharCode(
            sign > 0 ?
                COMMS_FLOAT_POS_BYTE + index :
                COMMS_FLOAT_NEG_BYTE + index
        )
    }
    return "0"
}