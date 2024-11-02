import React, { useState } from 'react';
import SubTopicBox from '../components/SubTopicBox';
import GoBack from '../components/GoBack';
import { useNavigate } from 'react-router-dom';
import '../App.css';

function SubTopic() {
    const mainTopic = "여행";
    const navigate = useNavigate();

    const subTopics = [
      {
        id: 1,
        name: "쇼핑",
        levels: {
          easy: "기념품 구매하기",
          normal: "옷 사이즈 및 스타일 고르기",
          hard: "물건 환불 또는 교환하기",
        },
      },
      {
        id: 2,
        name: "호텔",
        levels: {
          easy: "체크인/체크아웃하기",
          normal: "방 서비스 요청하기",
          hard: "방 변경 또는 예약 문제 해결하기",
        },
      },
      {
        id: 3,
        name: "공항",
        levels: {
          easy: "티켓 수령하기",
          normal: "환전하기",
          hard: "수하물 분실 신고하기",
        },
      },
    ];
  
    const [selectedSubTopic, setSelectedSubTopic] = useState(null);
    const [selectedLevel, setSelectedLevel] = useState(null);
    const [description, setDescription] = useState('');
  
    const handleSubTopicSelect = (subTopic) => {
      setSelectedSubTopic(subTopic);
      setSelectedLevel(null); // Reset level
      setDescription(''); // Reset description
    };
  
    const handleLevelSelect = (level) => {
      if (selectedSubTopic) {
        setSelectedLevel(level);
        setDescription(selectedSubTopic.levels[level]); // Update description based on selected sub-topic and level
      }
    };
  

    return (
      <div className="SubTopic">
        <GoBack /> 
        <h2>{mainTopic}</h2>
        <div className="sub-topic-container">
          {subTopics.map((topic) => (
            <SubTopicBox
              key={topic.id}
              topic={topic}
              isSelected={selectedSubTopic && selectedSubTopic.id === topic.id}
              onSelect={() => handleSubTopicSelect(topic)}
              selectedLevel={selectedLevel}
              onLevelSelect={handleLevelSelect}
              description={description}
            />
          ))}
        </div>
      
        {/* Start Learning Button */}
        <button className="next-button" onClick={() => navigate('/conversation')} >
          학습 시작하기
        </button>
      </div>
    );
}

export default SubTopic;
