import { Link, useNavigate } from "react-router-dom";
import React, { useEffect, useContext, useState } from "react";
import { UserContext } from "../UserContext";
import IMAGES from "../images/images";
import axios from '../axiosConfig'; 
import '../App.css';

export default function Header() {
  const [showDropdown, setShowDropdown] = useState(false);
  const [topics, setTopics] = useState([]);
  const [selectedTopic, setSelectedTopic] = useState(null);
  const { userInfo, setUserInfo } = useContext(UserContext);
  const username = userInfo?.email;
  const [isFetched, setIsFetched] = useState(false);
  const navigate = useNavigate();

  // Fetch topics from the backend
  const fetchTopics = async () => {
    try {
      const response = await axios.get('/topic/');
      if (response.status === 200) {
        setTopics(response.data);
      }
    } catch (error) {
      console.error("Failed to fetch topics:", error);
    }
  };

  // Function to fetch profile info
  const fetchProfile = async () => {
    try {
      const response = await axios.get('/user/profile', { withCredentials: true });

      setUserInfo(response.data);
    } catch (error) {
      console.error("Failed to fetch profile:", error);
    }
  };

  useEffect(() => {
    const temp = async () => {
      await fetchProfile();
      await fetchTopics();
      setIsFetched(true);
    };
    temp();
  }, []);

  useEffect(() => {
    if (isFetched && !userInfo) {
      alert("로그아웃 상태이므로 초기화면으로 이동합니다.");
      navigate('/');
    }
  }, [isFetched, userInfo, navigate]); 

  const logout = async () => {
    await axios.post("/user/logout");
    setUserInfo(null); 
  };

  const handleTopicClick = (id) => {
    setSelectedTopic(id);
  };

  const handleSubtopicClick = (mainTopic, subTopicName) => {
    navigate('/subtopic', { state: { selectedTopic: mainTopic, subTopic: subTopicName } });
  };

  return (
    <div className="header">
      <div className="header-top">
        <div className="header-left">
          <Link to="/home" className="header-title">Bestie Tutor</Link>
          <div className="header-links">
            <Link to="/about">소개</Link>
            <Link to="/notice">공지</Link>
            <Link to="/events">이벤트</Link>
          </div>
        </div>
        <div className="header-mypage">
          {username ? (
            <>
              <button onClick={logout} className="logout-button">로그아웃</button>
              <Link to="/myPage"><img src={IMAGES.mypage} alt="mypage" className="mypageimg" /></Link>
            </>
          ) : null}
        </div>
      </div>

      <div className="header-content">
        {topics.map((topic) => (
          <div
            className="header-item"
            key={topic._id}
            onMouseEnter={() => setShowDropdown(true)}
          >
            {topic.mainTopic}
          </div>
        ))}
      </div>

      {showDropdown && (
        <div className="dropdown-container" onMouseLeave={() => setShowDropdown(false)}>
          <div className="dropdown-content">
            {topics.map((topic) => (
              <div key={topic.mainTopic}>
                {topic.subTopics.map((subTopic) => (
                  <p
                    key={subTopic.name}
                    onClick={() => handleSubtopicClick(topic.mainTopic, subTopic.name)}
                    className="dropdown-subtopic"
                  >
                    {subTopic.name}
                  </p>
                ))}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}