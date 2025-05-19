import React, { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../UserContext';
import Header from "../components/Header";
import Footer from "../components/Footer";
import axios from "axios";
import IMAGES from '../images/images';
import '../App.css';

export default function EditGoal() {
    const navigate = useNavigate();
    const { userInfo } = useContext(UserContext);
    const userId = userInfo?.userId;

    const [step, setStep] = useState(1);
    const [language, setLanguage] = useState(userInfo?.language || 'English');
    const [goals, setGoals] = useState(userInfo?.learningGoals || []);
    const [level, setLevel] = useState(userInfo?.currentSkillLevel || '');
    const [topics, setTopics] = useState(userInfo?.preferredTopics || []);

    const availableGoals = ['여행 준비', '학업', '생산적인 시간 활동', '사람들과 소통', '경력 개발', '취미 활동', '기타'];
    const availableTopics = ['일상', '비즈니스', '취미', '여행'];
    const displayLanguage =
        language === 'English' ? '영어' :
            language === '한국어' ? '한국어' : '일본어';
    const availableLevels = [
        `${displayLanguage}를 처음 배워요`,
        '기본적인 대화를 할 수 있어요',
        '다양한 주제에 대해 이야기할 수 있어요'
    ];

    const handleSave = async () => {
        const userData = {
            userId,
            language,
            learningGoals: goals,
            currentSkillLevel: level,
            preferredTopics: topics
        };

        try {
            const response = await fetch('/preference', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(userData)
            });
            const result = await response.json();
            if (result.message === '선호도 조사 완료') {
                navigate('/home');
            } else {
                alert('저장 중 오류가 발생했습니다.');
            }
        } catch (error) {
            alert('서버 연결 실패');
        }
    };

    const GoalSection = () => (
        <div className='section'>
            <p className='section-title'>학습 목표 (최대 3개)</p>
            <div className='edit-grid'>
                {availableGoals.map((goal, index) => (
                    <div
                        key={index}
                        className='goal-item'
                        style={{ backgroundColor: goals.includes(goal) ? '#EBFFEE' : '#FAFAFC' }}
                        onClick={() => {
                            setGoals(prev => prev.includes(goal)
                                ? prev.filter(g => g !== goal)
                                : prev.length < 3 ? [...prev, goal] : prev
                            );
                        }}
                    >
                        <img src={IMAGES[goal.replace(/ /g, '_')]} alt={goal} className='goal-icon' />
                        <p className='goal-text'>{goal}</p>
                    </div>
                ))}
            </div>
        </div>
    );

    const LevelSection = () => (
        <div className='section'>
            <p className='section-title'>현재 실력</p>
            <div className='edit-grid-single'>
                {availableLevels.map((lvl, index) => (
                    <div
                        key={index}
                        className='level-item'
                        style={{ backgroundColor: level === lvl ? '#EBFFEE' : '#FAFAFC' }}
                        onClick={() => setLevel(lvl)}
                    >
                        <p className='goal-text'>{lvl}</p>
                    </div>
                ))}
            </div>
        </div>
    );

    const TopicSection = () => (
        <div className='section'>
            <p className='section-title'>관심 분야 (최대 3개)</p>
            <div className='edit-grid'>
                {availableTopics.map((topic, index) => (
                    <div
                        key={index}
                        className='preferredTopic-item'
                        style={{ backgroundColor: topics.includes(topic) ? '#EBFFEE' : '#FAFAFC' }}
                        onClick={() => {
                            setTopics(prev => prev.includes(topic)
                                ? prev.filter(t => t !== topic)
                                : prev.length < 3 ? [...prev, topic] : prev
                            );
                        }}
                    >
                        <img src={IMAGES[topic]} alt={topic} className='preferredTopic-icon' />
                        <p className='goal-text'>{topic}</p>
                    </div>
                ))}
            </div>
        </div>
    );

    return (
        <div className="Home">
            <Header />
            <div className='edit-container'>
                <header className='edit-header'>
                    <span className='edit-backarrow' onClick={() => navigate('/home')}>←</span>
                    <h2 className='edit-title'>학습 목표 수정하기</h2>
                </header>

                <div className='edit-body'>
                    <div className='edit-sidebar'>
                        <button onClick={() => setStep(1)} className={step === 1 ? 'active' : ''}>외국어 학습 목표</button>
                        <button onClick={() => setStep(2)} className={step === 2 ? 'active' : ''}>실력 선택</button>
                        <button onClick={() => setStep(3)} className={step === 3 ? 'active' : ''}>관심 분야</button>
                    </div>

                    <main className='edit-main'>
                        {step === 1 && <GoalSection />}
                        {step === 2 && <LevelSection />}
                        {step === 3 && <TopicSection />}

                        <button className='next-button' onClick={handleSave}>
                            수정 완료
                        </button>
                    </main>
                </div>
            </div>
            <Footer />
        </div>
    );
}