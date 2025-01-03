import { Link, useNavigate } from "react-router-dom";
import React, { useEffect, useContext, useState } from "react";
import { LanguageContext } from "../LanguageContext";
import { UserContext } from "../UserContext";
import IMAGES from "../images/images";
import axios from '../axiosConfig'; 
import '../App.css';
import { TbRuler2 } from "react-icons/tb";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleDown } from "@fortawesome/free-solid-svg-icons";


export default function Header({ totalTime }) {
  const [showDropdown, setShowDropdown] = useState(false);
  const [topics, setTopics] = useState([]);
  const [lockedStages, setLockedStages] = useState([]);
  const { userLanguage, setUserLanguage } = useContext(LanguageContext);
  const { userInfo, setUserInfo } = useContext(UserContext);
  const [currentTopic, setCurrentTopic] = useState(null);
  const [allLanguages, setAllLanguages] = useState([]);
  const username = userInfo?.email;
  const [selectedSubTopic, setSelectedSubTopic] = useState(null);
  const [selectedLevel, setSelectedLevel] = useState(null);
  const navigate = useNavigate();
  const stageRequirements = {
    '1단계': 0,    
    '2단계': 10,
    '3단계': 30,  
    '4단계': 60,  
  };

  const getAllLanguages = async () => {
    try{
      const response = await axios.get('/conversation/getAllLanguages');
      if (response.status === 200) {
        setAllLanguages(response.data.languages);
      }
    } catch (error) {
      // console.error("Failed to fetch Languages:", error);
    }
  }

  // 언어 설정 및 변환 함수
  const handleRecentLanguage = (language) => {
    switch (language) {
      case 'English':
        setUserLanguage("en");
        break;
      case 'Korean':
      case '한국어':
        setUserLanguage("ko");
        break;
      case 'Japanese':
      case '日本語':
        setUserLanguage("ja");
        break;
      default:
        setUserLanguage("en");
        break;
    }
  };

  // LanguageContext를 최근 대화 언어로 설정
  const getRecentLanguage = async () => {
    try {
        const userEmail = userInfo?.email;
        const response = await axios.get(`/conversation/getRecentLanguage/${userEmail}`);
        if (response.status === 200) {
          const recentLanguage = response.data.conversation.selected_language;
          handleRecentLanguage(recentLanguage);
          english > en
        } else {
          // 최근 대화가 없으면 선호도 조사 언어로 설정
            const userId = userInfo?.userId;
            const response = await axios.get(`/preference/${userId}`);
            const preferenceLanguage = response.data.preferences.language;
            handleRecentLanguage(preferenceLanguage);
        }
    } catch (error) {
        // console.error('Error fetching RecentLanguage:', error);
    }
  };

  useEffect(() => {
    getAllLanguages();
    getRecentLanguage();
  }, []);

  useEffect(() => {
    if (!userInfo) {
      alert("로그아웃 상태이므로 초기화면으로 이동합니다.");
      navigate('/');
    }
  }, [userInfo, navigate]);

  const logout = async () => {
    await axios.post("/user/logout");
    setUserInfo(null); 
  };


  const handleLanguageChange = (language) => {
    setUserLanguage(language); 
  };

  function getDisplayName(language) {
    switch (language) {
      case 'ko':
        return "한국어";
      case 'en':
        return "English";
      case 'ja':
        return "日本語";
      default:
        return "English";
    }
  };

  const selectedLanguage = getDisplayName(userLanguage);

  /***주제 선택 ***/
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

  const handleMouseEnter = (topic) => {
    setCurrentTopic(topic); 
    setShowDropdown(true); 
  };

  const handleMouseLeave = () => {
    setCurrentTopic(null); 
    setShowDropdown(false);
    setSelectedSubTopic(null);
  };

  useEffect(() => {
      if (topics) {
          const fetchSubTopics = async () => {
              try {
                  const response = await axios.get(`/topic/${topics}`);
                  setSubTopics(response.data);
              } catch (error) {
                  console.error("소주제를 불러오는데 실패했습니다.", error);
              }
          };
          fetchSubTopics();
      }
  }, [topics]);

  const handleSubTopicHover = (subTopic) => {
    setSelectedSubTopic(subTopic);
  };

  const handleLevelSelect = (level) => {
    if (selectedSubTopic) {
      const difficulty = selectedSubTopic.difficulties.find((d) => d.difficulty === level);
      if (difficulty) {
        navigate('/chooseCharacter', {
          state: {
            mainTopic: currentTopic?.mainTopic,
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



  return (
    <div className="header">
      <div className="header-top">
        <div className="header-left">
          <Link to="/home" className="header-title">Bestie Tutor</Link>
          <div className="header-links">
            <Link to="/about">소개</Link>
            <Link to="/notice">공지</Link>
            <Link to="/event">이벤트</Link>
          </div>
        </div>
        <div className="header-right">
          <div className="header-language">
          <div className="lang-dropdown">
            <button className="lang-dropdown-button">
              <img src={IMAGES.global} alt="global" className="globalimg" />
              <p>{selectedLanguage}</p>
            </button>
            <div className="lang-dropdown-menu">
            {allLanguages.map((language, index) => (
              <p 
                key={index}
                onClick={() => handleLanguageChange(language.code)}
              >
                {getDisplayName(language.code)}
              </p>
            ))}
            </div>
          </div>
        </div>
          <div className="header-mypage">
            {username ? (
              <>
                <button onClick={logout} className="logout-button">로그아웃</button>
                <Link to="/mypage"><img src={IMAGES.mypage} alt="mypage" className="mypageimg" /></Link>
              </>
            ) : null}
          </div>
        </div>
      </div>

      
      <div className="header-content">
      {topics.map((topic) => {
        const isLocked = lockedStages.find((stage) => stage.stage === topic.mainTopic)?.isLocked ?? true;

        return (
          <div
            key={topic._id}
            className={`header-item ${isLocked ? 'locked' : 'unlocked'}`}
            
            onMouseEnter={() => {
              if (!isLocked) {
                handleMouseEnter(topic);
              }
            }}
            onMouseLeave={handleMouseLeave} 
            onClick={isLocked ? null : () => console.log('Topic clicked:', topic)}
            >
              {topic.mainTopic}{' '}
              {isLocked ? (
                  <img src={IMAGES.lock} alt="lock" className="lockimg" />
                ) : (
                  <FontAwesomeIcon icon={faAngleDown} style={{color: "#1c1c1c"}} size="xs" />
                )}

            {/* 드롭다운 콘텐츠 */}
            {currentTopic && currentTopic._id === topic._id && showDropdown && (
              <div className="dropdown-container">
                <div className="dropdown-content">
                  {currentTopic.subTopics.map((subTopic) => (
                    <div
                      className="dropdown-subtopic"
                      key={subTopic.name}
                      onMouseEnter={() => handleSubTopicHover(subTopic)}
                    >
                      {subTopic.name}{' '}
                      <FontAwesomeIcon icon={faAngleDown} rotation={270} style={{color: "#1c1c1c",} } size="xs"/>

                      {/* 소주제 세부 정보 */}
                      {selectedSubTopic && selectedSubTopic.name === subTopic.name && (
                <div className="subtopic-details">
                  {selectedSubTopic.difficulties.map((difficulty) => (
                    <div
                      key={difficulty.difficulty}
                      className={`difficulty-item ${
                        selectedLevel === difficulty.difficulty ? 'selected' : ''
                      }`}
                      onClick={() => handleLevelSelect(difficulty.difficulty)}
                    >
                      <p className= "difficultyp">{difficulty.difficulty}</p>
                      <p className= "descriptionp">{difficulty.description}</p>
                      </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    )}
  </div>
);
  })}
</div>
       
    </div>
  );
}