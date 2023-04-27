import { FC } from "react"
import { NeedleViz } from "./NeedleViz"
import { MAX_KPH, MOTOR_MAX_RPM } from "../lib/speed"
import { useStatValue } from "../store/stats"

export const SpeedViz: FC = () => {
    const kph = useStatValue("speed")
    const motorRpm = useStatValue("motorRpm")
    return (
        <div className="speed-viz">
            <NeedleViz
                minValue={0}
                maxValue={MAX_KPH}
                value={kph}
                stringify={n => Math.round(n).toString()}
                label="km/h" />
            <div className="horizontal-line" />
            <NeedleViz
                minValue={0}
                maxValue={Math.round(MOTOR_MAX_RPM / 1000)}
                value={motorRpm / 1000}
                stringify={n => Math.round(n * 1000).toString()}
                label="RPM×1000" />
        </div>
    )
}