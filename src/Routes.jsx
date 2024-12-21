import { Routes, Route } from "react-router-dom";
import { Start, UserAgreement, Register, Login, Home, 
    FindPw, Conversation, RegistrationSuccess, Topic, SubTopic, 
    ChooseCharacter, ChooseLanguage, LearningGoal, CurrentLevel, PreferredTopic,
    MyPage, Profile, Review, Feedback,FreeSubject } from "./pages";
// import Feedback from "./pages/Feedback";

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
            <Route path="/conversation" element={<Conversation />} />
            <Route path="/registrationSuccess" element={<RegistrationSuccess />} />
            <Route path="/topic" element={<Topic />} />
            <Route path="/subtopic" element={<SubTopic />} />
            <Route path="/chooseCharacter" element={<ChooseCharacter />} />
            <Route path="/chooseLanguage" element={<ChooseLanguage />} />
            <Route path="/learningGoal" element={<LearningGoal />} />
            <Route path="/currentLevel" element={<CurrentLevel />} />
            <Route path="/preferredTopic" element={<PreferredTopic />} />
            <Route path="/feedback" element={<Feedback />} />
            <Route path="/myPage" element={<MyPage />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/review" element={<Review />} />
            <Route path="/freesubject" element={<FreeSubject />} />
        </Routes>
    );
}

