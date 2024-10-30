import { Routes, Route } from "react-router-dom";
import { Start, UserAgreement, Register, Login,Home,FindPw } from "./pages";

export default function AppRoutes() {
    return(
        <Routes>
            {/* Route: 컴포넌트 별로 원하는 url을 지정 */}
            <Route path="/" element={<Start />} />
            <Route path="/userAgreement" element={<UserAgreement />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/home" element={<Home />} />
            <Route path="/findpw" element={<FindPw />} />
        </Routes>
    );
}

