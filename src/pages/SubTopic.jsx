import React, { useState, useEffect } from 'react';
import axios from 'axios';
import SubTopicBox from '../components/SubTopicBox';
import GoBack from '../components/GoBack';
import { useNavigate, useLocation } from 'react-router-dom';
import '../App.css';

function SubTopic() {
    const navigate = useNavigate();
    const location = useLocation();
    const selectedTopic = location.state?.selectedTopic;

    const [mainTopic, setMainTopic] = useState(selectedTopic || '');
    const [subTopics, setSubTopics] = useState([]);
    const [selectedSubTopic, setSelectedSubTopic] = useState(null);
    const [selectedLevel, setSelectedLevel] = useState(null);
    const [description, setDescription] = useState('');
    const [isSubTopicSelected, setIsSubTopicSelected] = useState(true);
    const [isLevelSelected, setIsLevelSelected] = useState(true);
    const [isClicked, setIsClicked] = useState(false);

    useEffect(() => {
        if (mainTopic) {
            const fetchSubTopics = async () => {
                try {
                    const response = await axios.get(`/topic/${mainTopic}`);
                    setSubTopics(response.data);
                } catch (error) {
                    console.error("소주제를 불러오는데 실패했습니다.", error);
                }
            };
            fetchSubTopics();
        }
    }, [mainTopic]);

    const handleSubTopicSelect = (subTopic) => {
        setSelectedSubTopic(subTopic);
        setSelectedLevel(null); // 레벨 초기화
        setDescription(''); // 설명 초기화
        setIsSubTopicSelected(true);
    };

    const handleLevelSelect = (level) => {
        if (selectedSubTopic) {
            const difficulty = selectedSubTopic.difficulties.find((d) => d.level === level);
            if (difficulty) {
                setSelectedLevel(level);
                setDescription(difficulty.description);
                setIsLevelSelected(true);
            }
        }
    };

    const handleStartLearning = () => {
        setIsClicked(true); // 버튼 클릭 시 경고 메시지 표시
        let valid = true;

        if (!selectedSubTopic) {
            setIsSubTopicSelected(false); // 소주제가 선택되지 않음
            valid = false;
        } else {
            setIsSubTopicSelected(true);
        }

        if (!selectedLevel) {
            setIsLevelSelected(false); // 레벨이 선택되지 않음
            valid = false;
        } else {
            setIsLevelSelected(true);
        }

        if (valid) {
            // 'conversation' 페이지로 데이터 전달
            navigate('/conversation', {
                state: {
                    mainTopic,
                    selectedSubTopic: selectedSubTopic.name,
                    selectedLevel,
                    description
                }
            });
        }
    };

    return (
        <div className="SubTopic">
            <GoBack />
            <h2>{mainTopic}</h2>
            <div className="sub-topic-container">
                {subTopics.map((subTopic) => (
                    <SubTopicBox
                        key={subTopic.name}
                        topic={subTopic.name}
                        isSelected={selectedSubTopic && selectedSubTopic.name === subTopic.name}
                        onSelect={() => handleSubTopicSelect(subTopic)}
                        selectedLevel={selectedLevel}
                        onLevelSelect={handleLevelSelect}
                        description={description}
                    />
                ))}
            </div>

            {/* 학습 시작하기 버튼 클릭 후 경고 메시지 표시 */}
            {isClicked && !isSubTopicSelected && (
                <p className="warning-text">소주제를 선택해주세요.</p>
            )}
            {isClicked && !isLevelSelected && (
                <p className="warning-text">난이도를 선택해주세요.</p>
            )}

            {/* Start Learning Button */}
            <button
                className="next-button"
                onClick={handleStartLearning}
            >
                학습 시작하기
            </button>
        </div>
    );
}

export default SubTopic;
