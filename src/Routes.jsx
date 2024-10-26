import { Route, Routes as RouterRoutes } from "react-router-dom";
import Start from "./pages/Start";
import Register from "./pages/Register";
import Login from "./pages/Login";

export default function AppRoutes() {
    return(
        <RouterRoutes>
            <Route path="/" element={<Start />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
        </RouterRoutes>
    );
}

