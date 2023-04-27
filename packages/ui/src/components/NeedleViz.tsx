import { FC } from "react"

type Props = {
    minValue: number,
    maxValue: number,
    value: number,
    className?: string,
    stringify: (value: number) => string,
    label: string,
}

const angle = 110

const circleStyle = (ratio: number) => ({
    transform: `rotate(${(-angle / 2) + angle * ratio}deg)`
})

export const NeedleViz: FC<Props> = (props) => {
    const ratio = (props.value - props.minValue) / (props.maxValue - props.minValue)
    return (
        <div className={"needle-viz " + props.className}>
            <div className="min">{Math.round(props.minValue)}</div>
            <div className="mid">{Math.round((props.maxValue - props.minValue) / 2)}</div>
            <div className="max">{Math.round(props.maxValue)}</div>
           
            <div className="clip">
                <div className="circle" style={circleStyle(ratio)}>
                    <div className="needle" />
                </div>
            </div>

            <div className="value">
                <div className="number">{props.stringify(props.value)}</div>
                <div className="label">{props.label}</div>
            </div>
        </div>
    )
}