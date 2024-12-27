import '../App.css';
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import GoBack from '../components/GoBack';
import IMAGES from "../images/images";

export default function FreeSubject() {
    const [inputFreeSubject, setInputFreeSubject] = useState("");
    const navigate = useNavigate();

    const handleSubmit = () => {
        if (inputFreeSubject.trim()) {
            navigate("/chooseCharacter", { state: { freeSubject: inputFreeSubject } }); 
        } else {
            alert("주제를 입력해주세요!");
        }
    };

    
    return (
        <div className="FreeSubject">
            <GoBack className='conversation-goBack'/> 
            <div className="free-subject-container">
                <h2>자유 대화</h2>
                <img src={IMAGES.time0} alt="freetalkbetu" className="freetalkbetu" />
                <div className="free_speechbubble_box">
                    <p className="free_talk_text">나와 어떤 대화를 할래?</p>
                </div>
                <input
                    className="freeSubjectInputBox"
                    type="text"
                    value={inputFreeSubject}
                    onChange={(e) => setInputFreeSubject(e.target.value)}
                    placeholder="원하는 주제를 입력하세요"
                />
                <img src={IMAGES.next} alt="next" className="nextButton" />

                

                <button className="fs-next-button" onClick={handleSubmit}>대화시작하기</button>        
            </div>
        </div>
      );
};