import GoBack from '../components/GoBack';
import TopicItem from '../components/TopicItem';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import IMAGES from "../images/images";
import '../App.css';

const Topic = () => {
    const [topics, setTopics] = useState([]); // 백엔드에서 받아올 주제 목록
    const [selectedTopic, setSelectedTopic] = useState(null);
    const navigate = useNavigate();

    // 주제를 백엔드에서 가져오는 함수
    const fetchTopics = async () => {
        console.log("fetchTopics함수 호출");
        const response = await axios.get('/topic/'); // API 호출
        if (response.status === 200) {
            console.log(response.data);
            setTopics(response.data); // 주제 목록 상태에 저장
        }
        else {
            console.error("주제 목록을 불러오는데 실패했습니다.", response.status);
        }
    };

    
    useEffect(() => {
        fetchTopics(); // 컴포넌트가 마운트될 때 주제 목록을 불러옴
    }, []);

    const handleTopicClick = (id) => {
        setSelectedTopic(id);
    };

    
    const handleNextClick = () => {
        // selectedTopic에 해당하는 mainTopic을 찾아서 넘기기
        const topic = topics.find(t => t._id === selectedTopic); // selectedTopic id로 해당 topic 찾기
        if (topic) {
            navigate('/subtopic', { state: { selectedTopic: topic.mainTopic } }); // mainTopic 값 넘기기
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
                            icon={IMAGES[topic.mainTopic]} // 이미지 경로는 아이콘 이름을 이용하여 참조
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
