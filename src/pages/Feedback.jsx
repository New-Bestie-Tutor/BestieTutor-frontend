import GoBack from '../components/GoBack';
import IMAGES from '../images/images';
import { IoMdMic } from "react-icons/io";
import { MdKeyboard } from "react-icons/md";
import { FaXmark } from "react-icons/fa6";
import { LuSendHorizonal } from "react-icons/lu";
import '../App.css';
import { useState, useEffect, useRef, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';


export default function Feedback() {
    // 하드코딩된 대화와 피드백 데이터
    const messages = [
        { sender: 'assistant', text: "Hey, I was just about to call you. What's up?" },
        { sender: 'user', text: 'Hi, how are you?', feedback: { type: 'success', text: '친절하고 자연스럽게 말하셨어요.' } },
        { sender: 'assistant', text: "I'm good. How's your work week?" },
        {
        sender: 'user',
        text: "It's really hard week.",
        feedback: { type: 'error', text: '문법적으로는 맞지만, 더 자연스럽게 말하려면 "It’s been a really hard week"라고 말해보세요.' },
        },
        {
        sender: 'assistant',
        text: "I'm sorry to hear that. What do you want to do for dinner on Friday night?",
        },
    ];

    const location = useLocation();
    console.log("Location State: ", location.state);
    const { 
      mainTopic, 
      selectedSubTopic, 
      selectedLevel, 
      description, 
      selectedCharacter 
    } = useMemo(() => ({
        mainTopic: location.state?.mainTopic,
        selectedSubTopic: location.state?.selectedSubTopic,
        selectedLevel: location.state?.selectedLevel,
        description: location.state?.description,
        selectedCharacter: location.state?.selectedCharacter
    }), [location.state]);

    // 기본 이미지 설정
    const characterImage = selectedCharacter 
        ? IMAGES[selectedCharacter] 
        : IMAGES['bettu']; // 'bettu'가 기본 이미지 키라고 가정


    // 대화주제 & 캐릭터 선택 사항 console.log
    useEffect(() => {
      console.log("mainTopic:", mainTopic);
      console.log("selectedSubTopic:", selectedSubTopic);
      console.log("selectedLevel:", selectedLevel);
      console.log("description:", description);
      console.log("selectedCharacter:", selectedCharacter);
    }, [mainTopic, selectedSubTopic, selectedLevel, description, selectedCharacter]);


  return (
<div className="container feedback-container">
{/* 헤더 */}
<div className="feedback-header">
<button className="goBack-button">✕</button>
<h2 className="feedback-title">Small talk</h2>
</div>


  {/* 대화 내용 */}
  <div className="feedback-chat">
    {messages.map((message, index) => (
      <div key={index}>
        {/* 메시지와 피드백을 감싸는 컨테이너 */}
        <div className={`message-container ${message.sender === 'user' ? 'user' : 'assistant'}`}>
          {/* 메시지 버블 */}
          <div
            className={`feedback-bubble ${
              message.sender === 'user' ? 'user' : 'assistant'
            }`}
          >
            {message.sender === 'assistant' && (
              <>
                <img
                  src={characterImage}
                  alt="Assistant"
                  className="feedback-image"
                />
                <div className="bubble-text">{message.text}</div>
              </>
            )}
            {message.sender === 'user' && (
              <div className="bubble-text">{message.text}</div>
            )}
          </div>

          {/* 피드백 코멘트 (사용자 메시지에만 표시) */}
          {message.sender === 'user' && message.feedback && (
            <div className={`feedback-comment ${message.feedback.type}`}>
              <p>{message.feedback.text}</p>
            </div>
          )}
        </div>
      </div>
    ))}
  </div>
</div>
);
}
