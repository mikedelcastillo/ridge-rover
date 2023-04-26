import { FC } from "react"
import { useSelector } from "react-redux"
import { StoreState } from "../store"

export const CameraFeed: FC = () => {
    const ip = useSelector((state: StoreState) => state.websocket.ip)
    const url = `http://${ip}:8080/?action=stream`
    return (
        <div className="camera-feed">
            <img src={url} key={url} />
        </div>
    )
}