import { BrowserRouter as Router } from "react-router-dom";
import AppRoutes from "../src/router/Router"; // Ensure correct path
import "bootstrap/dist/css/bootstrap.min.css";
import "animate.css/animate.min.css";

function App() {
    return (
        <Router>
            <AppRoutes />
        </Router>
    );
}

export default App;
