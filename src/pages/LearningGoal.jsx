import GoBack from '../components/GoBack';
import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import IMAGES from "../images/images";
import '../App.css';

export default function LearningGoal() {
    const navigate = useNavigate();
    const location = useLocation();
    const language = location.state?.language;

    const goals = ['여행 준비', '학업', '생산적인 시간 활동', '사람들과 소통', '경력 개발', '취미 활동', '기타'];
    const [selectedGoals, setSelectedGoals] = useState([]);

    const handleNextSurvey = () => {
        // 목표 중복 선택 가능
        if (selectedGoals.length >= 1 && selectedGoals.length <= 3) {
            navigate('/currentLevel', { state: { language: language, goals: selectedGoals} }); 
        }
    };

    const handleGoalClick = (goal) => {
        setSelectedGoals((prev) => {
            if(prev.includes(goal)){
                //목표가 이미 선택된 경우, 선택 해제
                return prev.filter((item) => item !== goal);
            } else if (prev.length < 3){
                return [...prev, goal];
            }
            return prev;
        });
    };
    
    return (
        <div className="topic">

            <GoBack className='topic-goBack'/> 
            <p className="conversation-title">학습 목표를 선택해주세요
            <span style={{ fontSize: '15px', color: 'rgba(0, 0, 0, 0.36)' }}>
                (최대 3개)
            </span>
            </p>

            <div className='character-wrapper'>
                <div className="goal-list">
                    {goals.map((goal, index) => (
                    <div 
                        key={index}
                        className='goal-item' 
                        style={{ backgroundColor: selectedGoals.includes(goal) ? '#b8f0d2' : '#FFFFFF' }} 
                        onClick={() => handleGoalClick(goal)}
                    >
                        <img src={IMAGES[goal.replace(/ /g, '_')]} alt={goal.replace(/ /g, '_')} className="goal-icon" />
                        <p className="goal-text">{goal}</p>
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
