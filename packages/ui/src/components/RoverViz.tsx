import { FC } from "react"
import { useSelector } from "react-redux"
import { StoreState } from "../store"
import { RangeViz } from "./RangeViz"
import { WheelViz } from "./WheelViz"

export const RoverViz: FC = () => {
    const state = useSelector((state: StoreState) => state)
    return (
        <div className="rover-viz">
            <RangeViz
                className="steer-viz"
                targetValue={state.input.steerTarget}
                actualValue={state.board.state.targetSteer} />
            <RangeViz
                className="throttle-viz"
                targetValue={-state.input.throttleTarget}
                actualValue={-state.board.state.targetThrottle} />
            <WheelViz />
        </div>
    )
}