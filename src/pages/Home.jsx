import React, { useEffect, useContext, useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserContext } from "../UserContext";
import Footer from "../components/Footer";
import Header from "../components/Header";
import IMAGES from "../images/images";
import axios from "axios";
import RecordCard from "../components/RecordCard";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleDown } from "@fortawesome/free-solid-svg-icons";
import '../App.css';

export default function Home() {
  const { userInfo } = useContext(UserContext);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);
  const userId = userInfo?.userId;
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [totalTime, setTotalTime] = useState(0);
  const [nextGoal, setNextGoal] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);
  const [inactiveDays, setInactiveDays] = useState(0);
  const [conversations, setConversations] = useState([]);
  const [topics, setTopics] = useState([]);
  const [lockedStages, setLockedStages] = useState([]);
  const [selectedSubTopic, setSelectedSubTopic] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedLevel, setSelectedLevel] = useState(null);

  const userEmail = userInfo?.email;
  const steps = [0, 10, 30, 60, 120];

  const stageRequirements = {
    '1단계': 0,
    '2단계': 10,
    '3단계': 30,
    '4단계': 60,
  };

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
      const response = await axios.get(`/conversation/${userEmail}/history`);
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

  const updateTotalTime = async () => {
    try {
      if (userId) {
        const response = await axios.put("/user/updateTotalTime", {
          userId,
          totalTime: totalTime.toFixed(1),
        });

        if (response.status === 200) {
          console.log("총 사용 시간이 성공적으로 업데이트되었습니다.");
        } else {
          console.error("총 사용 시간 업데이트 실패:", response.status);
        }
      }
    } catch (error) {
      console.error("서버로 총 사용 시간 전송 중 오류 발생:", error);
    }
  };

  useEffect(() => {
    const total = conversations.reduce((sum, conversation) => {
      const startTime = new Date(conversation.start_time);
      const endTime = conversation.end_time ? new Date(conversation.end_time) : 0;
      const duration = endTime ? endTime - startTime : 0;
      return sum + duration / (1000 * 60);
    }, 0);

    setTotalTime(total);

    if (total > 0) {
      updateTotalTime();
    }

    const step = steps.findIndex((s) => total <= s);
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
    if (step > 10 && daysInactive >= 30) {
      return { image: IMAGES.after30days, text: "흥" };
    } else if (step > 10 && daysInactive >= 10) {
      return { image: IMAGES.after10days, text: "미워..." };
    } else {
      switch (step) {
        case 0:
          return { image: IMAGES.BettuHome, text: "...개구리가 우스워..?" };
        case 1:
          return { image: IMAGES.BettuHome, text: "조금 더 친해질래..?" };
        case 2:
          return { image: IMAGES.BettuHome, text: "조금만 더 화이팅!" };
        case 3:
          return { image: IMAGES.BettuHome, text: "멋져!" };
        default:
          return { image: IMAGES.BettuHome, text: "내 둘도 없는 친구야!" };
      }
    }
  };

  const { image, text } = getImageAndText(currentStep, inactiveDays);

// 주제 선택
  useEffect(() => {
    const fetchTopicsAndLockStatus = async () => {
      try {
        const topicsResponse = await axios.get('/topic/');
        const lockedStatuses = determineLockStatus(userInfo?.total_time || 0, stageRequirements);
        setTopics(topicsResponse.data);
        setLockedStages(lockedStatuses);
      } catch (error) {
        console.error("Failed to fetch topics or lock status:", error);
      }
    };
    fetchTopicsAndLockStatus();
  }, [userInfo?.total_time]);

  const handleSubTopicHover = (subTopic) => {
    setSelectedSubTopic(subTopic);
  };

  const handleLevelSelect = (level) => {
    if (selectedSubTopic) {
      const difficulty = selectedSubTopic.difficulties.find((d) => d.difficulty === level);
      if (difficulty) {
        navigate('/chooseCharacter', {
          state: {
            mainTopic: selectedSubTopic.mainTopic,
            selectedSubTopic: selectedSubTopic.name,
            selectedLevel: level,
            description: difficulty.description,
          },
        });
      }
    }
  };

  const determineLockStatus = (totalTime, requirements) => {
    const statuses = Object.keys(requirements).map((stage) => ({
      stage,
      isLocked: totalTime < requirements[stage],
    }));
    return statuses;
  };

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setShowDropdown(false);
    }
  };

  useEffect(() => {
    window.addEventListener("click", handleClickOutside);
    return () => {
      window.removeEventListener("click", handleClickOutside);
    };
  }, []);

  return (
    <div className="Home">
      <Header totalTime={totalTime} />
      <div className="main-container">
        <section className="friendliness-section" style={{ backgroundImage: `url(${IMAGES.homeBackground})` }}>
          <div className="action-group">
            <p className="logo">Free Talk ♥</p>
            <p className="gotoTopicTxt">베튜랑 더 친해지러가기</p>
            {totalTime < 10 && (
              <p className="lock-message">
                내가 하고 싶은 대화 주제를 선정하여 편하게 대화해요
              </p>
            )}
            <div className={`gotoTopic ${totalTime >= 10 ? '' : 'disabled'}`}
              onClick={totalTime >= 10 ? () => navigate('/freeSubject') : null}>
              <img src={IMAGES.start} alt="start" className="start" />
            </div>
          </div>

          <img src={image} alt="친밀도 단계 이미지" className="intimacy_image" />
          <div className="speechbubble_box">
            <img src={IMAGES.베튜말풍선} alt="intimacy_speechbubble" className="intimacy_speechbubble" />
            <p className="intimacy_text">{text}</p>
          </div>
        </section>
        <div className="greeting-section">
          <div className="greeting-text">
            <h2>
              {userInfo?.nickname
                ? `${userInfo.nickname}님!♥ 또 만나서 반가워요`
                : "사용자님!♥ 또 만나서 반가워요"}
            </h2>

            <p>
              즐거운 여행을 위해 베튜와 함께 공부해요{" "}<br></br>
              <Link to="/editGoal" className="edit-goal-link">
                학습 목표 수정하기
              </Link>
            </p>
          </div>
          <div className="intimacy_box">
            <p className="time">♥ 친밀도 | {totalTime.toFixed(1)}분</p>
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
            <div className="progress-bar">
              <div
                className="filled"
                style={{
                  width: `${Math.min(100, totalTime).toFixed(1)}%`,
                }}
              />
            </div>
          </div>
        </div>
        <div className="stage-grid">
          {topics.map((topic) => {
            const isLocked = lockedStages.find((stage) => stage.stage === topic.mainTopic)?.isLocked ?? true;

            return (
              <div key={topic._id} className={`stage-card ${isLocked ? 'locked' : ''}`}>
                <div className="stage-title">
                  {topic.mainTopic}
                  {isLocked && <img src={IMAGES.lock} alt="lock" className="stage-lock" />}
                </div>

                {!isLocked && (
                  <div className="dropdown-content">
                    {topic.subTopics.map((subTopic) => (
                      <div
                        key={subTopic.name}
                        className="subtopic-name"
                        onClick={() => {
                          setSelectedSubTopic({
                            ...subTopic,
                            mainTopic: topic.mainTopic,
                          });
                          setIsModalOpen(true);
                        }}
                      >
                        {subTopic.name}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
        {isModalOpen && selectedSubTopic && (
          <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
            <div className="modal-box" onClick={(e) => e.stopPropagation()}>
              <h3 className="modal-title">{selectedSubTopic.name}</h3>
              <div className="modal-difficulties">
                {selectedSubTopic.difficulties.map((difficulty) => (
                  <div
                    key={difficulty.difficulty}
                    className={`difficulty-item ${selectedLevel === difficulty.difficulty ? 'selected' : ''}`}
                    onClick={() => {
                      handleLevelSelect(difficulty.difficulty);
                      setIsModalOpen(false);
                    }}
                  >
                    <p className="difficultyp">{difficulty.difficulty}</p>
                    <p className="descriptionp">{difficulty.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
        <div className="mafia-top-text">
          <h2 className="mafia-title">마피아 게임하기</h2>
          <p className="mafia-subtitle">Bestie Tutor만의 특별한 언어 학습 게임!</p>
        </div>
        <div className="lets-mafia-wrapper" onClick={() => navigate('/mafiasetup')}>
          <img src={IMAGES.LetsMafia} alt="Let's play Mafia" className="lets-mafia-img" />
          <div className="mafia-img-text">
            <p className="mafia-subtext">동물 친구들과 함께 아지트에 놀러온 당신!</p>
            <h2 className="mafia-img-title">다같이 외국어로 대화하며 마피아를 찾아보세요!</h2>
          </div>
          <button className="mafia-button">게임 시작하기</button>
        </div>
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
                    key={conversation._id}
                    record={{ ...conversation }}
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
