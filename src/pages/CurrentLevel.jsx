import GoBack from '../components/GoBack';
import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import '../App.css';

export default function CurrentLevel() {
    const navigate = useNavigate();
    const location = useLocation();
    const { language, goals } = location.state;
    const displayLanguage = 
            language === 'English' ? '영어' :
            language === 'Japanese' ? '일본어' : '한국어';

    const levels = [`${displayLanguage}를 처음 배워요`, '기본적인 대화를 할 수 있어요', '다양한 주제에 대해 이야기할 수 있어요'];
    const [selectedLevel, setSelectedLevel] = useState(null);

    const handleNextSurvey = () => {
        if (selectedLevel) {
            navigate('/preferredTopic', { state: { language: language, goals: goals, level: selectedLevel} }); 
        }
    };

    return (
        <div className="topic">

            <GoBack className='topic-goBack'/> 
            <p className="conversation-title">당신의 실력을 선택해주세요</p>

            <div className='character-wrapper'>
                <div className="level-list">
                    {levels.map((level, index) => (
                    <div 
                        key={index}
                        className='level-item' 
                        style={{ backgroundColor: selectedLevel === level ? '#EBFFEE' : '#FAFAFC' }} 
                        onClick={() => setSelectedLevel(level)}
                    >
                        <p className="goal-text">{level}</p>
                    </div>
                    ))}
                </div>
            </div>
            {/* Start Learning Button*/}
            <button 
                className="next-button" 
                onClick={handleNextSurvey}
            >
                다음
            </button>
        </div>
    );
};
