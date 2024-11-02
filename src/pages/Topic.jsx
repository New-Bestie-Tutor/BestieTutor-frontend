import GoBack from '../components/GoBack';
import TopicItem from '../components/TopicItem';
import IMAGES from "../images/images";
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../App.css';

const Topic = () => {
    const [selectedTopic, setSelectedTopic] = useState(null);
    const navigate = useNavigate();

    const topics = [
        { id: 1, icon: IMAGES.calendar, text: '일상' },
        { id: 2, icon: IMAGES.travel, text: '여행' },
        { id: 3, icon: IMAGES.business, text: '비즈니스' },
        { id: 4, icon: IMAGES.hobbies, text: '취미' },
    ];

    const handleTopicClick = (id) => {
        setSelectedTopic(id);
    };

    return (
        <div className="topic">
            <GoBack /> 
            <h2>주제를 선택해 주세요</h2>
            <div className="topic-list">
                {topics.map((topic) => (
                    <TopicItem
                        key={topic.id}
                        icon={topic.icon}
                        text={topic.text}
                        selected={selectedTopic === topic.id}
                        onClick={() => handleTopicClick(topic.id)}
                    />
                ))}
            </div>
        <button className="next-button" onClick={() => navigate('/subtopic')}>주제 선택하기</button>
        </div>
    );
};

export default Topic;
