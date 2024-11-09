import { Link, useNavigate } from "react-router-dom";
import React, { useEffect, useContext, useState } from "react";
import { UserContext } from "../UserContext";
import IMAGES from "../images/images";
import axios from 'axios';
import '../App.css';

export default function Header() {
  const [showDropdown, setShowDropdown] = useState(false);
  const [topics, setTopics] = useState([]);
  const [selectedTopic, setSelectedTopic] = useState(null);
  const { userInfo, setUserInfo } = useContext(UserContext);
  const username = userInfo?.username;
  const navigate = useNavigate();

  // Fetch topics from the backend
  const fetchTopics = async () => {
    try {
      const response = await axios.get('/topic/');
      if (response.status === 200) {
        setTopics(response.data); // Corrected to update topics state
      }
    } catch (error) {
      console.error("Failed to fetch topics:", error);
    }
  };

  useEffect(() => {
    fetchTopics();
  }, []);

  const logout = async () => {
    await axios.post("/logout");
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
        <div class="header-left">
          <Link to="/home" className="header-title">Bestie Tutor</Link>
          <div className="header-links">
            <Link to="/about">소개</Link>
            <Link to="/notice">공지</Link>
            <Link to="/events">이벤트</Link>
          </div>
        </div>
        <div className="header-mypage">
          <button onClick={logout} className="logout-button">로그아웃</button>
          <Link to="/mypage"><img src={IMAGES.mypage} alt="mypage" className="mypageimg" /></Link>
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
