import GoBack from '../components/GoBack';
import CharacterItem from '../components/CharacterItem';
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useMemo } from 'react';
import axios from 'axios';
import IMAGES from "../images/images";
import '../App.css';

export default function ChooseCharacter() {
    const navigate = useNavigate();
    const location = useLocation();
    const { mainTopic, selectedSubTopic, selectedLevel, description } = useMemo(() => ({
        mainTopic: location.state?.mainTopic,
        selectedSubTopic: location.state?.selectedSubTopic,
        selectedLevel: location.state?.selectedLevel,
        description: location.state?.description
    }), [location.state]);

    const [characters, setCharacters] = useState([]); // 백엔드에서 받아올 캐릭터 목록
    const [selectedCharacter, setSelectedCharacter] = useState(null);

    // 캐릭터를 백엔드에서 가져오는 함수
    const fetchCharacters = async () => {
        const response = await axios.get('/character/'); // API 호출
        if (response.status === 200) {
            // console.log(response.data);
            setCharacters(response.data); // 캐릭터 목록 상태에 저장
        }
        else {
            console.error("캐릭터 목록을 불러오는데 실패했습니다.", response.status);
        }
    };

    
    useEffect(() => {
        fetchCharacters(); // 컴포넌트가 마운트될 때 캐릭터 목록을 불러옴
    }, []);

    const handleCharacterClick = (name) => {
        setSelectedCharacter(name);
    };

    
    const handleStartLearning = () => {
        let valid = true;
        
        // 캐릭터 선택 여부 확인
        if (!selectedCharacter) {
            valid = false;
        }
        
        if (valid) {
            // 'conversation' 페이지로 데이터 전달
            navigate('/conversation', {
                state: {
                    mainTopic,
                    selectedSubTopic,
                    selectedLevel,
                    description,
                    selectedCharacter
                }
            });
        }
    };
    

    return (
        <div className="topic">

            <GoBack className='topic-goBack'/> 
            <p className="conversation-title">함께 대화할 친구를 선택해주세요</p>

            <div className='character-wrapper'>
                <div className="character-list">
                    {characters.map((character) => (
                        <CharacterItem
                        key={character._id}
                        icon={IMAGES[character.name]} 
                        text={character.name}
                        selected={selectedCharacter === character.name}
                        onClick={() => handleCharacterClick(character.name)}
                        />
                    ))}
                    
                </div>
            </div>
            {/* Start Learning Button*/}
            <button
                className="next-button"
                onClick={handleStartLearning}
            >
                학습 시작하기
            </button>
        </div>
    );
};
