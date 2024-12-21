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
    const { mainTopic,freeSubject, selectedSubTopic, selectedLevel, description } = useMemo(() => ({
        mainTopic: location.state?.mainTopic,
        freeSubject: location.state?.freeSubject,
        selectedSubTopic: location.state?.selectedSubTopic,
        selectedLevel: location.state?.selectedLevel,
        description: location.state?.description
    }), [location.state]);

    const [characters, setCharacters] = useState([]); 
    const [selectedCharacter, setSelectedCharacter] = useState(null);

    // 캐릭터를 백엔드에서 가져오는 함수
    const fetchCharacters = async () => {
        const response = await axios.get('/character/');
        if (response.status === 200) {
            setCharacters(response.data); 
        }
        else {
            // console.error("캐릭터 목록을 불러오는데 실패했습니다.", response.status);
        }
    };

    
    useEffect(() => {
        fetchCharacters();
    }, []);

    const handleCharacterClick = (name) => {
        setSelectedCharacter(name);
    };

    
    const handleStartLearning = () => {
        let valid = true;
        
        if (!selectedCharacter) {
            valid = false;
        }
        
        if (valid) {
            navigate('/conversation', {
                state: {
                    mainTopic,
                    freeSubject,
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

            <GoBack className='goBack'/> 
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
            <button
                className="next-button"
                onClick={handleStartLearning}
            >
                학습 시작하기
            </button>
        </div>
    );
};
