import React, { useEffect, useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserContext } from "../UserContext";
import Footer from "../components/Footer";
import Header from "../components/Header";
import IMAGES from "../images/images";
import axios from "axios";
import RecordCard from "../components/RecordCard";
import "./Home.css";

export default function Home() {
  const { userInfo } = useContext(UserContext);
  const [records, setRecords] = useState([]);
  const userId = userInfo?.userId;
  const [user, setUser] = useState(null);
  const [totalTime, setTotalTime] = useState(0);
  const [nextGoal, setNextGoal] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);
  const [inactiveDays, setInactiveDays] = useState(0);
  const [conversations, setConversations] = useState([]);
  const userEmail = userInfo?.email;
  const steps = [10, 30, 60, 120];
  const navigate = useNavigate();
 // Fetch user data
 const fetchUser = async () => {
  try {
    const response = await axios.get("/user/getUser", {
      params: { userId },
    });

    if (response.status === 200) {
      setUser(response.data);
    } else {
      console.error("userId 불러오는데 실패했습니다.", response.status);
    }
  } catch (error) {
    console.error("API 호출 오류:", error);
  }
};

const fetchConversations = async () => {
  try {
      if (!userEmail) {
          console.error('이메일 값이 없습니다.');
          return;
      }
      const response = await axios.get(`/conversation/getConversationHistory/${userEmail}`);
      if (response.status === 200) {
          const data = response.data;
          setConversations(data.conversations);
        } else {
          console.error('대화 기록을 가져오는데 실패했습니다.', response.status);
        }
  } catch (error) {
      console.error('Error fetching conversations:', error);
  }
};

useEffect(() => {
  if (userId) {
    fetchUser();
  }
}, [userId]); 

useEffect(() => {
  if (userInfo?.email) {
    fetchConversations();
  }
}, [userInfo?.email]); 

  useEffect(() => {
    const total = conversations.reduce((sum, conversation) => {
      const startTime = new Date(conversation.startTime);
      const endTime = new Date(conversation.endTime);
      const duration = endTime - startTime;
      return sum + duration / (1000 * 60); 
    }, 0);

    setTotalTime(total);

    const step = steps.findIndex((s) => total < s);
    setCurrentStep(step === -1 ? steps.length - 1 : step);

    const goal = steps[step] || 0;
    setNextGoal(goal - total);

    const today = new Date();
    const lastActivity = conversations.reduce((latest, conversation) => {
      const recordDate = new Date(conversation.startTime);
      return recordDate > latest ? recordDate : latest;
    }, new Date(0));

    const daysInactive = Math.floor(
      (today - lastActivity) / (1000 * 60 * 60 * 24)
    );
    setInactiveDays(daysInactive);
  }, [conversations]);


  const getImageAndText = (step, daysInactive) => {
    if (daysInactive >= 30) {
      return { image: IMAGES.after30days, text: "흥" };
    } else if (daysInactive >= 10) {
      return { image: IMAGES.after10days, text: "미워..." };
    } else {
      switch (step) {
        case 0:
          return { image: IMAGES.time0, text: "...개구리가 우스워..?" };
        case 1:
          return { image: IMAGES.time10, text: "조금 더 친해질래..?" };
        case 2:
          return { image: IMAGES.time30, text: "조금만 더 화이팅!" };
        case 3:
          return { image: IMAGES.time60, text: "멋져!" };
        default:
          return { image: IMAGES.time120, text: "내 둘도 없는 친구야!" };
      }
    }
  };

  const { image, text } = getImageAndText(currentStep, inactiveDays);

  return (
    <div className="Home">
      <Header />
      <div className="main-container">
        <div className="greeting-section">
        <h2>
          {user?.nickname
            ? `${user.nickname}! 또 만나서 반가워요`
            : "사용자! 또 만나서 반가워요"}
        </h2>

          <p>
            즐거운 여행을 위해 베튜와 함께 공부해요{" "}
            <Link to="/edit-goals" className="edit-goal-link">
              목표 수정하기
            </Link>
          </p>
        </div>

        <section className="friendliness-section">
          <p className="logo">Bestie Tutor</p>
          <p className="gotoTopicTxt">베튜랑 더 <br />친해지러가기</p>
          <Link to="/topic" className="gotoTopic">
            <img src={IMAGES.start} alt="start" className="start" />
            </Link>
          
            <img src={image} alt="친밀도 단계 이미지" className="intimacy_image" />
            <div className="speechbubble_box">
              <img src={IMAGES.베튜말풍선} alt="intimacy_speechbubble" className="intimacy_speechbubble" />
              <p className="intimacy_text">{text}</p>
            </div>
          
            <div className="intimacy_box">
            <p className="time">♥ 친밀도: {totalTime.toFixed(1)}분</p>
              <p>
                다음 목표까지:{" "}
                <span className="next-goal">
                  {isNaN(nextGoal)
                    ? "0"
                    : nextGoal > 0
                    ? `${nextGoal.toFixed(1)}분 남음`
                    : "친밀도 100 달성!"}
                </span>
              </p>
            </div>
        </section>

        <section className="records-section">
          <div className="records-top">
          <h3>기록</h3>
          <Link to="/review" className="view-all-records">더보기</Link>
          </div>
          <div className="records-container">
            <div className="records-wrapper">
            {Array.isArray(conversations) &&
              conversations.slice(0, 9).map((conversation) => (
                <RecordCard
                  key={conversation.conversationId}
                  record={{...conversation}}
                />
              ))}
            </div>
          </div>
        </section>

      </div>
      <Footer />
    </div>
  );
}
