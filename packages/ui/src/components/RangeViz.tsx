import { FC } from "react"

type Props = {
    targetValue: number,
    actualValue?: number,
    className?: string,
}

const rangeToCSS = (range: number) => ({
    left: `${Math.max(0, Math.min(100, (0.5 + (range / 2)) * 100))}%`
})

export const RangeViz: FC<Props> = ({ targetValue, actualValue, className }) => {
    return (
        <div className={"range-viz " + className}>
            <div className="runway">
                <div className="needle target" style={rangeToCSS(targetValue)}></div>
                {typeof actualValue === "number" ? (
                    <div className="needle actual" style={rangeToCSS(actualValue)}></div>
                ) : null}
            </div>
        </div>
    )
}