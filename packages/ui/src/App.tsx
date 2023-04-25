import { Header } from "./components/Header"
import { RoverViz } from "./components/RoverViz"
import { Stats } from "./components/Stats"

function App() {
    return (
        <>
            <Header />
            <div className="rover-viz-container">
                <RoverViz />
            </div>
            <Stats />
        </>
    )
}

export default App
