import { CameraFeed } from "./components/CameraFeed"
import { Header } from "./components/Header"
import { RoverViz } from "./components/RoverViz"
import { SpeedViz } from "./components/SpeedViz"
import { Stats } from "./components/Stats"

function App() {
    return (
        <>
            <Header />
            <div className="dashboard-container">
                <CameraFeed />
                <div className="vertical-line" />
                <SpeedViz />
                <div className="vertical-line" />
                <RoverViz />
            </div>
            <Stats />
        </>
    )
}

export default App
