import GoBack from '../components/GoBack';
import CharacterItem from '../components/CharacterItem';
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import IMAGES from "../images/images";
import '../App.css';

export default function ChooseLanguage() {
    const navigate = useNavigate();

    const [languages, setLanguages] = useState([]); // 백엔드에서 받아올 언어 목록
    const [selectedLanguage, setSelectedLanguage] = useState(null);

    // 캐릭터를 백엔드에서 가져오는 함수
    const fetchLanguages = async () => {
        const response = await axios.get('/language/'); // API 호출
        if (response.status === 200) {
            setLanguages(response.data); // 언어 목록 상태에 저장
        }
        else {
            console.error("언어 목록을 불러오는데 실패했습니다.", response.status);
        }
    };

    
    useEffect(() => {
        // fetchLanguages(); // 컴포넌트가 마운트될 때 언어 목록을 불러옴
    }, []);

    const handleLanguageClick = (language) => {
        setSelectedLanguage(language);
    };

    
    const handleNextSurvey = () => {
        if (selectedLanguage) {
            navigate('/chooseLevel', { state: { language: selectedLanguage } }); 
        }
    };
    

    return (
        <div className="topic">

            <GoBack className='topic-goBack'/> 
            <p className="conversation-title">배울 언어를 선택해주세요</p>

            <div className='character-wrapper'>
                <div className="language-list">
                    {/* {languages.map((language) => (
                        <CharacterItem
                        key={language._id}
                        icon={IMAGES[language.language]} 
                        text={language.language}
                        selected={selectedLanguage === language.language}
                        onClick={() => handleLanguageClick(language.language)}
                        />
                    ))} */}
                    <div className='language-item' style={{ backgroundColor: selectedLanguage === 'English' ? '#4ED8B7' : '#EBFFEE' }} onClick={() => setSelectedLanguage('English')}>
                        <img src={IMAGES.English} alt="English" className="character-icon" />
                        <p className="character-text">English</p>
                    </div>
                    <div className='language-item' style={{ backgroundColor: selectedLanguage === "한국어" ? '#4ED8B7' : '#EBFFEE' }} onClick={() => setSelectedLanguage("한국어")}>
                        <img src={IMAGES.한국어} alt="한국어" className="character-icon" />
                        <p className="character-text">한국어</p>
                    </div>
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
