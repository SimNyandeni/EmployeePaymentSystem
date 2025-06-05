import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginForm from "./Login";
import Dashboard from "./dashboard";
import ProtectedRoute from './ProtectedRoute';



function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<LoginForm />} />
                <Route element={<ProtectedRoute />}>
                    <Route path="/dashboard" element={<Dashboard />} />
                </Route>
            </Routes>
        </Router>
    );
}

export default App
