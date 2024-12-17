import GoBack from '../components/GoBack';
import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { UserContext } from "../UserContext";
import '../App.css';
import axios from 'axios';
import IMAGES from "../images/images";

export default function PreferredTopic() {
    const navigate = useNavigate();
    const { userInfo } = useContext(UserContext);
    const userId = userInfo?.userId;
    const location = useLocation();
    const { language, goals, level } = location.state;
    
    const [topics, setTopics] = useState([]); 
    const [selectedTopics, setSelectedTopics] = useState([]);
    
    // Topics 조회 api 호출
    const fetchTopics = async () => {
        const response = await axios.get('/topic/'); 
        if (response.status === 200) {
            setTopics(response.data); 
        }
        else {
            // console.error("주제 목록을 불러오는데 실패했습니다.", response.status);
        }
    };

    useEffect(() => {
        fetchTopics();
    }, []);
    
    const handleNextSurvey = async () => {
        if (selectedTopics.length >= 1 && selectedTopics.length <= 3) {// 목표 3개까지 선택 가능
            const result = await preference();
            if (result && result.message === '선호도 조사 완료') {
                navigate('/home'); 
            } else {
                // console.error("선호도 조사에 문제가 발생했습니다.");
            }
        }
    };

    async function preference() {
        const userData = {
            userId: userId, 
            language: language,
            learningGoals: goals,
            preferredTopics: selectedTopics,
            currentSkillLevel: level
        };
    
        const response = await axios.post('/preference', userData); 
        return response.data;
      }

    const handleTopicClick = (topic) => {
        setSelectedTopics((prev) => {
            if(prev.includes(topic)){
                //목표가 이미 선택된 경우, 선택 해제
                return prev.filter((item) => item !== topic);
            } else if (prev.length < 3){
                return [...prev, topic];
            }
            return prev;
        });
    };

    return (
        <div className="topic">
            <GoBack className='goBack'/> 
            <p className="conversation-title">선호하는 주제를 선택해주세요
            <span style={{ fontSize: '15px', color: 'rgba(0, 0, 0, 0.36)' }}>
                (최대 3개)
            </span>
            </p>
            <div className='character-wrapper'>
                <div className="goal-list">
                    {topics.map((topic) => (
                    <div 
                        key={topic._id}
                        className='preferredTopic-item' 
                        style={{ backgroundColor: selectedTopics.includes(topic.mainTopic) ? '#EBFFEE' : '#FAFAFC' }}
                        onClick={() => handleTopicClick(topic.mainTopic)}
                    >
                        <img src={IMAGES[topic.mainTopic]} alt={topic.mainTopic} className="preferredTopic-icon" />
                        <p className="goal-text">{topic.mainTopic}</p>
                    </div>
                    ))}
                </div>
            </div>
            <button 
                className="next-button" 
                onClick={handleNextSurvey}
            >
                다음
            </button>
        </div>
    );
};
