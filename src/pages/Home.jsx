import React, { useEffect, useContext, useState } from "react";
import { Link } from "react-router-dom";
import { UserContext } from "../UserContext";
import Footer from "../components/Footer";
import Header from "../components/Header";
import IMAGES from "../images/images";
import axios from "axios";
import "./Home.css";

export default function Home() {
  const { userInfo } = useContext(UserContext);
  const [user, setUser] = useState(null);
  const userId = userInfo?.userId;
  const [totalTime, setTotalTime] = useState(0);
  const [nextGoal, setNextGoal] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);
  const [inactiveDays, setInactiveDays] = useState(0);
  const [scrollIndex, setScrollIndex] = useState(0);
  const steps = [10, 30, 60, 120];

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

  // Records
  const records = [
    {
      category: "일상",
      topic: "친구",
      date: "2024-10-21",
      time: 1,
      level: "normal",
      title: "친구와 약속 잡기",
    },
    {
      category: "여행",
      topic: "공항",
      date: "2024-10-21",
      time: 2,
      level: "hard",
      title: "티켓수령하기",
    },
    {
      category: "여행",
      topic: "쇼핑",
      date: "2024-11-20",
      time: 5,
      level: "easy",
      title: "기념품 구매하기",
    },
    {
      category: "여행",
      topic: "쇼핑",
      date: "2024-11-20",
      time: 0,
      level: "easy",
      title: "기념품 구매하기",
    },
  ];


  const handleScrollLeft = () => {
    setScrollIndex((prev) => Math.max(prev - 1, 0));
  };
  
  const handleScrollRight = () => {
    setScrollIndex((prev) => Math.min(prev + 1, Math.ceil(records.length / visibleCount) - 1));
  };

  useEffect(() => {
    document.querySelector('.records-wrapper').style.setProperty(
      '--scrollIndex',
      scrollIndex
    );
  }, [scrollIndex]);
  

  // Calculate total study time, inactivity, and determine current step
  useEffect(() => {
    const total = records.reduce((sum, record) => sum + record.time, 0);
    setTotalTime(total);

    const step = steps.findIndex((s) => total < s);
    setCurrentStep(step === -1 ? steps.length - 1 : step);

    const goal = steps[step] || 0;
    setNextGoal(goal - total);

    // Calculate inactivity days
    const today = new Date();
    const lastActivity = records.reduce((latest, record) => {
      const recordDate = new Date(record.date);
      return recordDate > latest ? recordDate : latest;
    }, new Date(0));

    const daysInactive = Math.floor(
      (today - lastActivity) / (1000 * 60 * 60 * 24)
    );
    setInactiveDays(daysInactive);
  }, [records]);

  // Get current image based on the step and inactivity
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
          <p className="gototopictxt">베튜랑 더 <br />친해지러가기</p>
          <Link to="/topic" className="gototopic">
            <img src={IMAGES.start} alt="start" className="start" />
            </Link>
          <div className="intimacy_betu">
            <img src={image} alt="친밀도 단계 이미지" className="intimacy_image" />
            <div className="speechbubble_box">
              <img src={IMAGES.베튜말풍선} alt="intimacy_speechbubble" className="intimacy_speechbubble" />
              <p className="intimacy_text">{text}</p>
            </div>
          </div>
          <div className="intimacy_box">
            <p className="time">♥ 친밀도: {totalTime}</p>
            <p>
              다음 목표까지:{" "}
              {nextGoal > 0 ? `${nextGoal}분 남음` : "친밀도 100 달성!"}
            </p>
          </div>
        </section>

        <section className="records-section">
          <h3>기록</h3>
          <div className="records-container">
            <button className="arrow left" onClick={handleScrollLeft}>
              {"<"}
            </button>
            <div className="records-wrapper">
              {records.map((record, index) => (
                <div className="record-card" key={index}>
                  <div className="record-header">
                    <div className="record-header-top">
                      <p className="record-category">{record.category}</p>
                      <p className="record-date">{record.date}</p>
                    </div>
                    <div className="record-header-second">
                      <p className="record-topic">{record.topic}</p>
                      <p className="record-time">{record.time}분</p>
                    </div>
                  </div>
                  <div className="record-content">
                    <span className={`level-badge ${record.level}`}>
                      {record.level === "easy"
                        ? "초급"
                        : record.level === "normal"
                        ? "중급"
                        : "고급"}
                    </span>
                    <p className="record-title">{record.title}</p>
                  </div>
                </div>
              ))}
            </div>
            <button className="arrow right" onClick={handleScrollRight}>
              {">"}
            </button>
          </div>
        </section>


      </div>
      <Footer />
    </div>
  );
}
