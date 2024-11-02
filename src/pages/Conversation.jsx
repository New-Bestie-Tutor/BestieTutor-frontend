import { useNavigate } from 'react-router-dom';
import GoBack from '../components/GoBack';
import IMAGES from '../images/images';
import { IoMdMic } from "react-icons/io";
import { MdKeyboard } from "react-icons/md";
import { FaXmark } from "react-icons/fa6";
import '../App.css';
import { useState } from 'react';
import axios from 'axios';

export default function Conversation() {
  async function getResponse(text) {
    const data = {
      text: text
    };
    const response = await axios.post('/conversation/conversation', data);
    if (response.status === 200) {
      console.log(response.data);
      setMessages(prevMessages => [...prevMessages, {sender: 'ai', text: response.data.gptResponse}]);
    }
    else {
      alert('실패했습니다.');
    }
  }
  const navigate = useNavigate();
  const [status, setStatus] = useState('');
  const [messages, setMessages] = useState([
    {sender: 'ai', text: "Hello! Let's talk."}
  ]);
  const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition || window.mozSpeechRecognition || window.msSpeechRecognition)();
  recognition.lang = 'en-US';
  const stopConversation = () => {
    alert('대화를 종료합니다.');
  } 
  const speakToMic = () => {
    recognition.start();
  } 
  const typing = () => {
    alert('문자를 입력해주세요.');
  } 
  recognition.onstart = () => {
    setStatus('목소리를 듣고 있어요.');
  };
  recognition.onresult = (event) => {
    const transcript = event.results[0][0].transcript;
    console.log(transcript);
    setMessages(prevMessages => [...prevMessages, {sender: 'me', text: transcript}]);
    getResponse(transcript);
  };
  recognition.onend = () => {
    setStatus('목소리를 정상적으로 인식했어요.');
  };
    return (
        <div className="container">
            <GoBack /> 
            <h2 className="conversation-title">가족 소개하기</h2>
            <div className='chat-container'>
                {messages.map(message => (
                    <div className={(message.sender === 'me' ? 'chatBubble chatBubbleRight' : 'bettuChatText')}>
                        {message.sender === 'ai' && <img src={IMAGES.bettu} alt="bettu" className="image chatImage"/>}
                        <div className={(message.sender === 'me' ? 'userChatText' : 'chatBubble')}>
                            {message.text}
                        </div>
                    </div>
                ))}
            </div>
            {status}
            <div className='userChatInput'>
                <FaXmark onClick={stopConversation} />
                <IoMdMic onClick={speakToMic}/>
                <MdKeyboard onClick={typing}/>
            </div>
        </div>
    );
  }