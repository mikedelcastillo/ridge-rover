import { FC } from "react"
import { useSelector } from "react-redux"
import { StoreState } from "../store"

const getLaggingAngle = (x: number) => -6.5812500001316 * x * x + 41.625000000416 * x
const getLeadingAngle = (x: number) => 7.5937500001519 * x * x + 39.375000000394 * x

const getAngle = (range: number) => {
    const lagg = Math.sign(range) * getLaggingAngle(Math.abs(range))
    const lead = Math.sign(range) * getLeadingAngle(Math.abs(range))
    return {
        left: range > 0 ? lagg : lead,
        right: range > 0 ? lead : lagg,
    }
}

const getSteerCss = (angle: number) => ({
    transform: `translate(-50%, -50%) rotate(${angle}deg)`
})

export const WheelViz: FC = () => {
    const state = useSelector((state: StoreState) => state)

    const steer = state.board.state.currentSteer
    const throttle = state.board.state.targetThrottle

    const bgStyle = {
        backgroundColor: `rgba(255, 255, 255, ${Math.abs(throttle) * 0.5})`
    }

    const angles = getAngle(steer)
    const leftSteerStyle = getSteerCss(angles.left)
    const rightSteerStyle = getSteerCss(angles.right)

    return (
        <div className="wheel-viz">
            <div className="gear-viz">
                <div className="gear">{state.input.gear}</div>
                <div className="label">Gear</div>
            </div>
            <div
                className="wheel front left"
                style={{
                    ...bgStyle,
                    ...leftSteerStyle,
                }}>
                <div className="value">{angles.left.toFixed(1)}&#176;</div>
            </div>
            <div
                className="wheel front right"
                style={{
                    ...bgStyle,
                    ...rightSteerStyle,
                }} >
                <div className="value">{angles.right.toFixed(1)}&#176;</div>
            </div>
            <div
                className="wheel rear left"
                style={{
                    ...bgStyle,
                }} >
                <div className="value">{Math.abs(Math.round(throttle * 100))}%</div>
            </div>
            <div
                className="wheel rear right"
                style={{
                    ...bgStyle,
                }} >
                <div className="value">{Math.abs(Math.round(throttle * 100))}%</div>
            </div>
        </div>
    )
}