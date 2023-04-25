import { FC, useEffect, useRef } from "react"
import { STATS } from "../store/stats"
import { useSelector } from "react-redux"
import { StoreState } from "../store"

export const Stats: FC = () => {
    return (
        <div className="stats">
            {(Object.keys(STATS) as (keyof typeof STATS)[]).map(id =>
                <Stat id={id} key={id}></Stat>
            )}
        </div>
    )
}

export const Stat: FC<{ id: keyof typeof STATS }> = ({ id }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const data = useSelector((state: StoreState) => state.stats[id])
    const lastValue = data[data.length - 1]
    const { title, stringify, min, max, capacity } = STATS[id]

    useEffect(() => {
        const draw = () => {
            if(canvasRef.current === null) return
            const canvas = canvasRef.current
            const context = canvas.getContext("2d")
            if(context === null) return
            if(data.length <= 1) return

            canvas.width = 200
            canvas.height = 50

            const y = (value: number) => (1 - ((value - min) / (max - min))) * canvas.height
            
            context.beginPath()
            context.strokeStyle = "white"
            context.moveTo(0, y(data[0]))
            for(let i = 1; i < data.length; i++){
                const x = (i / (data.length - 1)) * canvas.width
                context.lineTo(x, y(data[i]))
            }
            context.stroke()
        }

        draw()
    }, [data, canvasRef])
    return (
        <div className={"stat " + id.toLowerCase()}>
            <canvas ref={canvasRef} />
            <div className="details">
                <div className="title">{title}</div>
                {typeof lastValue !== "undefined" ? (
                    <div className="value">{stringify(lastValue)}</div>
                ) : null}
            </div>
        </div>
    )
}