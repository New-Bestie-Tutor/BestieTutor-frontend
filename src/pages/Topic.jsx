import GoBack from '../components/GoBack';
import TopicItem from '../components/TopicItem';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import IMAGES from "../images/images";
import '../App.css';

const Topic = () => {
    const [topics, setTopics] = useState([]); 
    const [selectedTopic, setSelectedTopic] = useState(null);
    const navigate = useNavigate();

    const fetchTopics = async () => {
        console.log("fetchTopics함수 호출");
        const response = await axios.get('/topic/'); 
        if (response.status === 200) {
            console.log(response.data);
            setTopics(response.data); 
        }
        else {
            console.error("주제 목록을 불러오는데 실패했습니다.", response.status);
        }
    };

    
    useEffect(() => {
        fetchTopics(); 
    }, []);

    const handleTopicClick = (id) => {
        setSelectedTopic(id);
    };

    
    const handleNextClick = () => {
        const topic = topics.find(t => t._id === selectedTopic); 
        if (topic) {
            navigate('/subtopic', { state: { selectedTopic: topic.mainTopic } }); 
        }
    };
    

    return (
        <div className="topic">
            <GoBack className='conversation-goBack'/> 
            <h2>주제를 선택해 주세요</h2>
            <div className="topic-list">
                {topics.map((topic) => (
                        <TopicItem
                            key={topic._id}
                            icon={IMAGES[topic.mainTopic]} 
                            text={topic.mainTopic}
                            selected={selectedTopic === topic._id}
                            onClick={() => handleTopicClick(topic._id)}
                        />
                    ))}
                
            </div>
            <button className="next-button" onClick={handleNextClick} disabled={!selectedTopic}>
                주제 선택하기
            </button>
        </div>
    );
};

export default Topic;
