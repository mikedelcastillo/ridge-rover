import { FC } from "react"
import { useSelector } from "react-redux"
import { StoreState } from "../store"
import { WebSocketStatus } from "../store/websocket"
import { connectWebSocket } from "../lib/websocket"

export const Header: FC = () => {
    const state = useSelector((state: StoreState) => state)
    const { status } = state.websocket
    return (
        <div className="header">
            <div className="left">Ridge Rover</div>
            <div className="right">
                <div className="ping">{state.websocket.ping}ms</div>
                <div className={"dot " + status.toLowerCase()}></div>
                {status === WebSocketStatus.DISCONNECTED ? (
                    <button onClick={() => connectWebSocket()}>Connect</button>
                ) : (
                    <div className="status">{status}</div>
                )}
            </div>
        </div>
    )
}