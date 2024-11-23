import GoBack from '../components/GoBack';
import IMAGES from '../images/images';
import { IoMdMic } from "react-icons/io";
import { MdKeyboard } from "react-icons/md";
import { FaXmark } from "react-icons/fa6";
import { LuSendHorizonal } from "react-icons/lu";
import '../App.css';
import { useState, useEffect, useRef, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import React, { useContext } from 'react';
import { UserContext } from '../UserContext';

export default function Conversation() {
  const navigate = useNavigate();
  const { userInfo } = useContext(UserContext);
  const location = useLocation();
    const { mainTopic, selectedSubTopic, selectedLevel, description, selectedCharacter } = useMemo(() => ({
        mainTopic: location.state?.mainTopic,
        selectedSubTopic: location.state?.selectedSubTopic,
        selectedLevel: location.state?.selectedLevel,
        description: location.state?.description,
        selectedCharacter: location.state?.selectedCharacter
    }), [location.state]);

    useEffect(() => {
      console.log("mainTopic:", mainTopic);
      console.log("selectedSubTopic:", selectedSubTopic);
      console.log("selectedLevel:", selectedLevel);
      console.log("description:", description);
      console.log("selectedCharacter:", selectedCharacter);
  }, [mainTopic, selectedSubTopic, selectedLevel, description, selectedCharacter]);

  const [status, setStatus] = useState('');
  const [messages, setMessages] = useState([]);
  const [typingVisible, setTypingVisible] = useState(false);// 타이핑 모드에서 input창 표시
  const [typingInput, setTypingInput] = useState('');// 사용자 입력 텍스트를 저장
  const chatEndRef = useRef(null);
  
  // 메시지가 추가될 때 자동 스크롤
  useEffect(() => {
      if(chatEndRef.current){
          chatEndRef.current.scrollIntoView({behavior: 'smooth'});
      }
  }, [messages]);

    // 오디오 재생 함수
    const playAudio = (audioBase64) => {
      const audio = new Audio(`data:audio/mp3;base64,${audioBase64}`);
      audio.play();
  };

  // 서버로 사용자의 텍스트를 보내 응답을 받아오는 비동기 함수
  async function getResponse(text) {
    try {
      const data = {
        text: text,
        conversationHistory: messages.map(message => ({
          role: message.sender === 'userText' ? 'user' : 'assistant',
          content: message.text
        })),
        mainTopic,
        subTopic: selectedSubTopic,
        difficulty: selectedLevel,
        characterName: selectedCharacter
      };
  
      const response = await axios.post(
        '/conversation/getResponse', 
        data, 
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }
      );
  
      if (response.status === 200) {
        const { gptResponse, audio } = response.data;
        console.log('GPT Response:', gptResponse);
        setMessages(prevMessages => [
          ...prevMessages, 
          { sender: 'bettuText', text: gptResponse }
        ]);
        playAudio(audio);
      } else {
        console.error('응답 오류:', response);
        alert('서버 요청이 실패했습니다.');
      }
    } catch (error) {
      console.error('에러 발생:', error);
      if (error.response) {
        console.error('서버 응답 데이터:', error.response.data);
      }
      alert('응답을 처리하는 중 오류가 발생했습니다: ${error.message}');
    }
  }



  // 음성 인식 설정
  const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition || window.mozSpeechRecognition || window.msSpeechRecognition)();
  recognition.lang = 'ko-KR';
  // recognition.lang = 'ja-JP';
  // recognition.lang = 'ko-KR';
  // recognition.lang = 'en-US';
  
  // 음성 인식 시작
  const speakToMic = () => {
    if(typingVisible){
      setTypingVisible(false);
    }
    recognition.start();
  } 
  // 음성 인식 이벤트 핸들러
  recognition.onstart = () => {
    setStatus('목소리를 듣고 있어요.');
  };
  // 인식된 음성 텍스트로 변환 & 서버로 텍스트를 전송하는 함수 호출
  recognition.onresult = (event) => {
    const transcript = event.results[0][0].transcript;
    console.log(transcript);
    setMessages(prevMessages => [...prevMessages, {sender: 'userText', text: transcript}]);
    getResponse(transcript);
  };
  //음성 인식 종료
  recognition.onend = () => {
    setStatus('목소리를 정상적으로 인식했어요.');
  };
  // 타이핑: input 입력창을 표시
  const typing = () => {
    if(status){
      setStatus('');
    }
    setTypingVisible(true);
  };
  const submitTyping = () => {
    typingInputHandler();
  };
  // 타이핑된 텍스트 메시지에 추가 & 서버로 텍스트를 전송하는 함수 호출
  const typingInputHandler = (e) => {
    // 입력한 텍스트를 사용자 메시지로 추가
    setMessages(prevMessages => [...prevMessages, {sender: 'userText', text: typingInput}]);
    console.log(typingInput);
    getResponse(typingInput);
    setTypingInput('');//input필드 초기화
    setTypingVisible(false);//input창 숨김
  }


  // 대화 종료
  const stopConversation = () => {
    alert('대화를 종료합니다.');
    navigate('/home'); 

  } 
    return (
        <div className="container conversation-container">
            <div className='conversation-header'>
                <GoBack className='conversation-goBack'/> 
                <p className="conversation-title">{description}</p>
            </div>
            <div className='chat-container'>
                {messages.map((message, index) => (
                    <div key={message.id || index} 
                    className={(message.sender === 'userText' ? 'chatBubble chatBubbleRight' : 'bettuChatText')}>
                        {message.sender === 'bettuText' && <img src={IMAGES[selectedCharacter]} alt={selectedCharacter} className="image chatImage"/>}
                        <div className={(message.sender === 'userText' ? 'userChatText' : 'chatBubble')}>
                            {message.text}
                        </div>
                    </div>
                ))}
                <div ref={chatEndRef}></div>
            </div>

            <div className='userChatInput'>
                <p className='userInput-status'>{status}</p>
                {/* 타이핑 모드 & input 입력창 */}
                {typingVisible && (
                  <form onSubmit={typingInputHandler} className='typingFrom'>
                    <input
                      type='text'
                      value={typingInput}
                      onChange={(e) => setTypingInput(e.target.value)}
                      placeholder='메시지를 입력해주세요.'
                      className='typingInput'/>
                    <LuSendHorizonal onClick={submitTyping} className='typingSendButton' />
                  </form>
                )}
                <div className='icon-container'>
                    <FaXmark onClick={stopConversation} />
                    <IoMdMic onClick={speakToMic}/>
                    <MdKeyboard onClick={typing}/>
                </div>
            </div>
        </div>
    );
  }