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
  const [user, setUser] = useState(null);
  const [records, setRecords] = useState([]);
  const userId = userInfo?.userId;
  const [totalTime, setTotalTime] = useState(0);
  const [nextGoal, setNextGoal] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);
  const [inactiveDays, setInactiveDays] = useState(0);
  const [scrollIndex, setScrollIndex] = useState(0);
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

  // Records
  const dummyRecords = [
    {
      _id: "67470b6e67114e1a55ddf2f7",
      user_id: "672f15f40b9044ea9b77f61e",
      start_time: "2024-11-26T11:05:54.289+00:00",
      end_time: null,
      topic_description: "취미 - 영화 - normal",
      converse_id: "6745ab9288210d517b986273",
      createdAt: "2024-11-26T11:05:54.308+00:00",
      updatedAt: "2024-11-26T11:05:54.308+00:00",
      __v: 0,
    },
    {
      _id: "67470b6e67114e1a55ddf2f8",
      user_id: "672f15f40b9044ea9b77f61e",
      start_time: "2024-11-25T10:05:54.289+00:00",
      end_time: null,
      topic_description: "여행 - 공항 - easy",
      converse_id: "6745ab9288210d517b986274",
      createdAt: "2024-11-25T10:05:54.308+00:00",
      updatedAt: "2024-11-25T10:05:54.308+00:00",
      __v: 0,
    },
    
      {"_id":{"$oid":"6745b549f8902b436a9f179f"},"user_id":{"$oid":"673f1eee6e4089458ae13f21"},"start_time":{"$date":{"$numberLong":"1732621641468"}},"end_time":null,"topic_description":"일상 - 가족 - normal","converse_id":{"$oid":"6745b549f8902b436a9f17a0"},"createdAt":{"$date":{"$numberLong":"1732621641483"}},"updatedAt":{"$date":{"$numberLong":"1732621641483"}},"__v":{"$numberInt":"0"}},
      {"_id":{"$oid":"6745ba17782053095e6f85e3"},"user_id":{"$oid":"672f15f40b9044ea9b77f61e"},"start_time":{"$date":{"$numberLong":"1732622871187"}},"end_time":null,"topic_description":"비즈니스 - 프로젝트 진행 - easy","converse_id":{"$oid":"6745ba17782053095e6f85e4"},"createdAt":{"$date":{"$numberLong":"1732622871189"}},"updatedAt":{"$date":{"$numberLong":"1732622871189"}},"__v":{"$numberInt":"0"}},
      {"_id":{"$oid":"6745c2b3b73237fc97ce2438"},"user_id":{"$oid":"672f15f40b9044ea9b77f61e"},"start_time":{"$date":{"$numberLong":"1732625075598"}},"end_time":null,"topic_description":"취미 - 운동 - easy","converse_id":{"$oid":"6745c2b3b73237fc97ce2439"},"createdAt":{"$date":{"$numberLong":"1732625075613"}},"updatedAt":{"$date":{"$numberLong":"1732625075613"}},"__v":{"$numberInt":"0"}}
    
  ];

  const fetchRecords = async () => {
    try {
      const response = await axios.get("/records"); // 서버 API 경로에 맞게 수정
      if (response.status === 200) {
        setRecords(response.data);
      } else {
        console.error("기록 데이터를 불러오는데 실패했습니다.");
        setRecords(dummyRecords); // 하드코딩된 데이터를 사용
      }
    } catch (error) {
      console.error("API 호출 오류:", error);
      setRecords(dummyRecords); // 오류 발생 시 하드코딩된 데이터를 사용
    }
  };


  const handleScrollLeft = () => {
    setScrollIndex((prev) => Math.max(prev - 1, 0));
  };
  
  const handleScrollRight = () => {
    const visibleCount = 3; // 한번에 보이는 카드 수
    setScrollIndex((prev) => Math.min(prev + 1, Math.ceil(records.length / visibleCount) - 1));
  };

  useEffect(() => {
    fetchUser();
    fetchRecords();
  }, []);

  // Calculate total study time, inactivity, and determine current step
  useEffect(() => {
    // fetchUser();
    // fetchRecords();

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

  useEffect(() => {
    document.querySelector(".records-wrapper").style.setProperty("--scrollIndex", scrollIndex);
  }, [scrollIndex]);

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
              <p className="time">♥ 친밀도: {totalTime}</p>
              <p>
                다음 목표까지:{" "}
                <span className="next-goal">
                  {isNaN(nextGoal)
                    ? "NaN"
                    : nextGoal > 0
                    ? `${nextGoal}분 남음`
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
            <button className="arrow left" onClick={handleScrollLeft}>
              {"<"}
            </button>
            <div className="records-wrapper">
              {records.slice(0, 9).map((record) => (
                <RecordCard key={record._id} record={record} />
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
