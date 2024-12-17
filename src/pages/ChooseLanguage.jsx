import GoBack from '../components/GoBack';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import IMAGES from "../images/images";
import '../App.css';

export default function ChooseLanguage() {
    const navigate = useNavigate();

    const languages = ['English', '한국어'];
    const [selectedLanguage, setSelectedLanguage] = useState(null);

    const handleNextSurvey = () => {
        if (selectedLanguage) {
            navigate('/learningGoal', { state: { language: selectedLanguage } }); 
        }
    };
    
    return (
        <div className="topic">
            <GoBack className='goBack'/> 
            <p className="conversation-title">배울 언어를 선택해주세요</p>

            <div className='character-wrapper'>
                <div className="language-list">
                    {languages.map((language, index) => (
                    <div 
                        key={index}
                        className='language-item' 
                        style={{ backgroundColor: selectedLanguage === language ? '#EBFFEE' : '#FAFAFC' }} 
                        onClick={() => setSelectedLanguage(language)}
                    >
                        <img src={IMAGES[language]} alt={language} className="character-icon" />
                        <p className="character-text">{language}</p>
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
