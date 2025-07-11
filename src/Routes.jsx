import { Routes, Route } from "react-router-dom";
import { Start, UserAgreement, Register, Login, Home, 
    FindPw, Conversation, RegistrationSuccess,
    ChooseCharacter, ChooseLanguage, LearningGoal, CurrentLevel, PreferredTopic,
    MyPage, Profile, Review,
    About, Event, Inquiry, Notice, Payment, MafiaSetup, MafiaGame, Setting, EditGoal } from "./pages";
import CombinedPage from "./pages/CombinedPage";

export default function AppRoutes() {
    return(
        <Routes>
            {/* Route: 컴포넌트 별로 원하는 url을 지정 */}
            <Route path="/" element={<CombinedPage />} />
            <Route path="/userAgreement" element={<UserAgreement />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/home" element={<Home />} />
            <Route path="/findpw" element={<FindPw />} />
            <Route path="/conversation" element={<Conversation />} />
            <Route path="/registrationSuccess" element={<RegistrationSuccess />} />
            <Route path="/chooseCharacter" element={<ChooseCharacter />} />
            <Route path="/chooseLanguage" element={<ChooseLanguage />} />
            <Route path="/learningGoal" element={<LearningGoal />} />
            <Route path="/currentLevel" element={<CurrentLevel />} />
            <Route path="/preferredTopic" element={<PreferredTopic />} />
            <Route path="/editGoal" element={<EditGoal />} />
            <Route path="/myPage" element={<MyPage />} />
            <Route path="/setting" element={<Setting />} />
            <Route path="/payment" element={<Payment />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/review" element={<Review />} />
            <Route path="/about" element={<About />} />
            <Route path="/notice" element={<Notice />} />
            <Route path="/inquiry" element={<Inquiry />} />
            <Route path="/event" element={<Event />} />
            <Route path="/mafiasetup" element={<MafiaSetup />} />
            <Route path="/mafiagame" element={<MafiaGame />} />
        </Routes>
    );
}

