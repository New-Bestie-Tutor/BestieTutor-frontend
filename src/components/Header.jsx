import { Link, useNavigate } from "react-router-dom";
import React, { useEffect, useContext, useState } from "react";
import { LanguageContext } from "../LanguageContext";
import { UserContext } from "../UserContext";
import IMAGES from "../images/images";
import axios from '../axiosConfig';
import '../App.css';
import { TbRuler2 } from "react-icons/tb";

export default function Header({ totalTime }) {
  const { userLanguage, setUserLanguage } = useContext(LanguageContext);
  const { userInfo, setUserInfo } = useContext(UserContext);
  const [allLanguages, setAllLanguages] = useState([]);
  const username = userInfo?.email;
  const navigate = useNavigate();


  const getAllLanguages = async () => {
    try{
      const response = await axios.get('/conversation/languages/all');
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
        const response = await axios.get(`/conversation/languages/recent/${userEmail}`);
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

  return (
    <div className="header">
      <div className="header-top">
        <Link to="/home" className="header-title">Bestie Tutor</Link>
        <div className="header-right">
          <div className="header-links">
            <Link to="/about">소개</Link>
            <Link to="/notice">공지</Link>
            <Link to="/event">이벤트</Link>
          </div>
          <div className="header-language">
            <div className="lang-dropdown">
              <button className="lang-dropdown-button">
                <img src={IMAGES.global} alt="global" className="globalimg" />
                <p>{selectedLanguage}</p>
                <img src={IMAGES.vector}/>
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
                <button onClick={logout} className="logout-button"><img src={IMAGES.logoutBlack} className="mypageimg" />로그아웃</button>
                <Link to="/mypage"><img src={IMAGES.mypage} alt="mypage" className="mypageimg" />회원정보</Link>
              </>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}