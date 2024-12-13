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
        setSelectedLevel(null); 
        setDescription(''); 
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
        setIsClicked(true); 
        let valid = true;

        if (!selectedSubTopic) {
            setIsSubTopicSelected(false); 
            valid = false;
        } else {
            setIsSubTopicSelected(true);
        }

        if (!selectedLevel) {
            setIsLevelSelected(false); 
            valid = false;
        } else {
            setIsLevelSelected(true);
        }

        if (valid) {
            navigate('/chooseCharacter', {
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
            
            <GoBack className='conversation-goBack'/> 
            <p className="conversation-title">{mainTopic}</p>
            
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

            {isClicked && !isSubTopicSelected && (
                <p className="warning-text">소주제를 선택해주세요.</p>
            )}
            {isClicked && !isLevelSelected && (
                <p className="warning-text">난이도를 선택해주세요.</p>
            )}

            <button
                className="next-button"
                onClick={handleStartLearning}
            >
                대화 친구 선택하기
            </button>
        </div>
    );
}

export default SubTopic;
