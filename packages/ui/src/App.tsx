import { useSelector } from "react-redux"
import { connectWebSocket } from "./lib/websocket"
import { StoreState } from "./store"

function App() {
    const state = useSelector((state: StoreState) => state)

    const connect = () => {
        connectWebSocket()
    }

    return (
        <>
            <pre>{JSON.stringify({
                status: state.websocket.status,
                ip: state.websocket.ip,
                ping: state.websocket.ping,
                lastPing: state.websocket.lastPing,
            }, null, 2)}</pre>
            <button onClick={connect}>Connect</button>
        </>
    )
}

export default App
