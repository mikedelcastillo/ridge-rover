import { CameraFeed } from "./components/CameraFeed"
import { Header } from "./components/Header"
import { RoverViz } from "./components/RoverViz"
import { Stats } from "./components/Stats"

function App() {
    return (
        <>
            <Header />
            <div className="dashboard-container">
                <CameraFeed />
                <RoverViz />
            </div>
            <Stats />
        </>
    )
}

export default App
