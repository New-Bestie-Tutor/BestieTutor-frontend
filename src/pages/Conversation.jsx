import GoBack from '../components/GoBack';
import IMAGES from '../images/images';
import { IoMdMic } from "react-icons/io";
import { MdKeyboard } from "react-icons/md";
import { FaXmark } from "react-icons/fa6";
import { LuSendHorizonal } from "react-icons/lu";
import { useState, useEffect, useRef, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import '../App.css';

export default function Conversation() {
  const location = useLocation();
  const {
    mainTopic,
    selectedSubTopic,
    selectedLevel,
    description,
    selectedCharacter,
  } = useMemo(
    () => ({
      mainTopic: location.state?.mainTopic,
      selectedSubTopic: location.state?.selectedSubTopic,
      selectedLevel: location.state?.selectedLevel,
      description: location.state?.description,
      selectedCharacter: location.state?.selectedCharacter,
    }),
    [location.state]
  );

  const [status, setStatus] = useState('');
  const [chatFlow, setChatFlow] = useState([
    { type: 'bettu', text: "Hello! Let's talk.", createdAt: new Date() },
  ]); // 전체 메시지 배열
  const [currentStage, setCurrentStage] = useState('bettu'); // 현재 단계 ('bettu', 'user', 'feedback')
  const [typingVisible, setTypingVisible] = useState(false); // 타이핑 모드에서 input창 표시
  const [typingInput, setTypingInput] = useState(''); // 사용자 입력 텍스트를 저장
  const chatEndRef = useRef(null);

  // 메시지가 추가될 때 자동 스크롤
  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatFlow]);

  // 메시지 추가 함수
  function addMessage(type, text) {
    setChatFlow((prev) => [
      ...prev,
      { type, text, createdAt: new Date() },
    ]);
  }

  // 서버로 사용자의 텍스트를 보내 응답을 받아오는 비동기 함수
  async function getResponse(text) {
    try {
      addMessage('user', text); // 사용자 메시지 추가
      const data = {
        text,
        conversationHistory: chatFlow.map((message) => ({
          role: message.type === 'user' ? 'user' : 'assistant',
          content: message.text,
        })),
        mainTopic,
        subTopic: selectedSubTopic,
        difficulty: selectedLevel,
        characterName: selectedCharacter,
      };

      const response = await axios.post('/conversation/getResponse', data, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (response.status === 200) {
        const { gptResponse, messageId } = response.data;
        addMessage('bettu', gptResponse); // 베튜 메시지 추가

        if (messageId) {
          fetchFeedback(messageId); // 피드백 메시지 추가
        }
      }
    } catch (error) {
      console.error('응답 처리 중 오류:', error);
    }
  }

  // 피드백 메시지 로드
  async function fetchFeedback(messageId) {
    try {
      const response = await axios.get(`/feedback/${messageId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (response.status === 200) {
        const feedbackText = response.data.feedback || '피드백을 가져올 수 없습니다.';
        addMessage('feedback', feedbackText); // 피드백 메시지 추가
      }
    } catch (error) {
      console.error('피드백 로드 중 오류:', error);
    }
  }

  // 타이핑된 텍스트 메시지 추가 및 서버로 전송
  const typingInputHandler = (e) => {
    e.preventDefault();
    getResponse(typingInput.trim());
    setTypingInput(''); // 입력창 초기화
    setTypingVisible(false); // 입력창 숨기기
  };

  // 음성 인식 설정 및 이벤트 핸들러
  const recognition = new (window.SpeechRecognition ||
    window.webkitSpeechRecognition)();
  recognition.lang = 'en-US';

  recognition.onresult = (event) => {
    const transcript = event.results[0][0].transcript;
    getResponse(transcript); // 서버로 전송
  };

  return (
    <div className="container conversation-container">
      <div className="conversation-header">
        <GoBack className="conversation-goBack" />
        <p className="conversation-title">{description}</p>
      </div>

      <div className="chat-container">
        {/* 메시지 출력 */}
        {chatFlow.map((message, index) => {
          if (message.type === 'bettu') {
            return (
              <div key={index} className="chatBubble bettuChatText">
                <img
                  src={IMAGES[selectedCharacter]}
                  alt={selectedCharacter}
                  className="image chatImage"
                />
                <div className="chatBubble">{message.text}</div>
              </div>
            );
          } else if (message.type === 'user') {
            return (
              <div key={index} className="chatBubble chatBubbleRight">
                <div className="userChatText">{message.text}</div>
              </div>
            );
          } else if (message.type === 'feedback') {
            const text =
              typeof message.text === 'string'
                ? message.text
                : typeof message.text === 'object'
                ? JSON.stringify(message.text.feedback, null, 2) // 객체를 보기 쉽게 문자열로 변환
                : '';

            return (
              <div key={index} className="chatBubble feedbackBubble">
                {text.split("\n").map((line, i) => (
                  <p key={i} className="feedback-line">
                    {line}
                  </p>
                ))}
              </div>
            );
          }
          return null;
        })}

        <div ref={chatEndRef}></div>
      </div>

      <div className="userChatInput">
        <p className="userInput-status">{status}</p>
        {typingVisible && (
          <form onSubmit={typingInputHandler} className="typingFrom">
            <input
              type="text"
              value={typingInput}
              onChange={(e) => setTypingInput(e.target.value)}
              placeholder="메시지를 입력해주세요."
              className="typingInput"
            />
            <LuSendHorizonal onClick={typingInputHandler} className="typingSendButton" />
          </form>
        )}
        <div className="icon-container">
          <FaXmark onClick={() => setTypingVisible(false)} />
          <IoMdMic onClick={() => recognition.start()} />
          <MdKeyboard onClick={() => setTypingVisible(true)} />
        </div>
      </div>
    </div>
  );
}
