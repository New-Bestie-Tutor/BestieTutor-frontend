import GoBack from '../components/GoBack';
import IMAGES from '../images/images';
import { IoMdMic } from "react-icons/io";
import { MdKeyboard } from "react-icons/md";
import { FaXmark } from "react-icons/fa6";
import { useState, useEffect, useRef, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function Conversation() {
  const navigate = useNavigate(); // useNavigate 훅 사용
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
  const [messages, setMessages] = useState([]);
  const [typingVisible, setTypingVisible] = useState(false); // 타이핑 모드에서 input창 표시
  const [typingInput, setTypingInput] = useState(''); // 사용자 입력 텍스트를 저장
  const chatEndRef = useRef(null);

  // 메시지가 추가될 때 자동 스크롤
  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  // 첫 발화 요청
  useEffect(() => {
    if (mainTopic && selectedSubTopic && selectedLevel && selectedCharacter) {
      InitialMessage(); // 첫 발화 요청
    }
  }, []);

  let isFetching = false;

  // 서버로 첫 발화 요청을 보내고 응답을 받아오는 비동기 함수
  async function InitialMessage() {
    if (isFetching) return; // 중복 호출 방지
    isFetching = true;
    try {
      const data = {
        mainTopic,
        subTopic: selectedSubTopic,
        difficulty: selectedLevel,
        characterName: selectedCharacter,
      };
  
      console.log("Request Data:", data); // 디버깅용
  
      const response = await axios.post(
        '/conversation/initialize',
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
        addMessage('bettu', gptResponse);
        playAudio(audio);
      } else {
        console.error('응답 오류:', response);
        alert('서버 요청이 실패했습니다.');
      }
    } catch (error) {
      console.error('첫 발화 처리 중 오류:', error);
      if (error.response) {
        console.error('서버 응답 데이터:', error.response.data);
      }
      alert(`첫 발화 요청 중 오류가 발생했습니다: ${error.message}`);
    }
  }

  // 오디오 재생 함수
  const playAudio = (audioBase64) => {
    const audio = new Audio(`data:audio/mp3;base64,${audioBase64}`);
    audio.onended = () => console.log("Audio finished playing."); // 디버깅
    audio.play();
  };

  // 메시지 추가 함수
  const addMessage = (sender, text) => {
    setMessages((prevMessages) => [
      ...prevMessages,
      { sender, text, timestamp: new Date() }
    ]);
  };

  const [converseId, setConverseId] = useState('');
  // 서버로 사용자의 텍스트를 보내 응답을 받아오는 비동기 함수
  async function getResponse(text) {
    try {
      addMessage('user', text); // 사용자 메시지 추가
      const data = {
        text,
        conversationHistory: messages.map((message) => ({
          role: message.type === 'user' ? 'user' : 'assistant',
          content: message.text,
        })),
        mainTopic,
        subTopic: selectedSubTopic,
        difficulty: selectedLevel,
        characterName: selectedCharacter,
      };

      const addUserMessageRequest = axios.post('/conversation/addUserMessage', data, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      const request = axios.post('/conversation/getResponse', data, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      const addUserMessageResponse = await addUserMessageRequest;
      if (addUserMessageResponse.status === 200) {
        const { messageId, conversationId } = addUserMessageResponse.data;
        setConverseId(conversationId);
        if (messageId) {
          fetchFeedback(messageId); // 피드백 메시지 추가
        }
      }

      const response = await request;
      if (response.status === 200) {
        const { gptResponse, audio } = response.data;
        addMessage('bettu', gptResponse); // 베튜 메시지 추가
        playAudio(audio);
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

  // 음성 인식 설정 및 이벤트 핸들러
  const recognition = new (window.SpeechRecognition ||
    window.webkitSpeechRecognition)();
    // recognition.lang = 'en-US';
    recognition.lang = 'ko-KR';
    // recognition.lang = 'ja-JP';

  // 음성 인식 시작
  const speakToMic = () => {
    if (typingVisible) {
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
    getResponse(transcript);
  };

  // 음성 인식 종료
  recognition.onend = () => {
    setStatus('목소리를 정상적으로 인식했어요.');
  };

  // 타이핑: input 입력창을 표시
  const typing = () => {
    if (status) {
      setStatus('');
    }
    setTypingVisible(true);
  };

  const submitTyping = () => {
    typingInputHandler();
  };

  // 타이핑된 텍스트 메시지 추가 및 서버로 전송
  const typingInputHandler = (e) => {
    getResponse(typingInput.trim());
    setTypingInput(''); // 입력창 초기화
    setTypingVisible(false); // 입력창 숨기기
  };

  // 대화 종료
  const stopConversation = () => {
    setConverseId('6753f2e06dedc4c3bcc1f901');
    console.log('converseId', converseId);
    updateEndTime(converseId);
  }

  // EndTime Update
  async function updateEndTime(converseId) {
    try {
      const response = await axios.put('/conversation/updateEndTime', { converseId });

      if (response.status === 200) {
        alert('대화를 종료합니다.');
        navigate('/home');
      }
    } catch (error) {
      console.error('피드백 로드 중 오류:', error);
    }
  }

  // 메세지 정렬: bettu - user - feedback 
  const renderMessage = (message, index) => {
    switch (message.sender) {
      case 'bettu':
        return (
          <div key={index} className="chatMessage">
            <img
              src={IMAGES[selectedCharacter]}
              alt={selectedCharacter}
              className="image chatImage"
            />
            <div className="chatBubble">
              <div className="bettuChatText">{message.text}</div>
            </div>
          </div>
        );

      case 'user':
        return (
          <div key={index} className="chatBubble chatBubbleRight">
            <div className="userChatText">{message.text}</div>
          </div>
        );

      case 'feedback':
        const sanitizedText = (JSON.stringify(message.text.feedback, null, 2) || '')
          .replace(/\\n/g, '')
          .replace(/\n/g, '')
          .replace(/\s+/g, ' ')
          .replace(/\\/g, '')
          .replace(/["]/g, '');

        return (
          <div key={index} className="chatBubble feedbackBubbleRight">
            <p className="userChatText">{sanitizedText}</p>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="container conversation-container">
      <div className="conversation-header">
        <GoBack className="conversation-goBack" />
        <p className="conversation-title">{description}</p>
      </div>

      <div className="chat-container">
        {messages
          .map((message, index) => renderMessage(message, index))}

        <div ref={chatEndRef}></div>
      </div>

      <div className="userChatInput">
        <p className="userInput-status">{status}</p>
        {typingVisible && (
          <form onSubmit={typingInputHandler} className="typingFrom">
            <textarea
              // type="text"
              value={typingInput}
              onChange={(e) => {
                setTypingInput(e.target.value);
                e.target.style.height = "auto";
                e.target.style.height = `${e.target.scrollHeight}px`;
              }}
              placeholder="메시지를 입력해주세요."
              className="typingInput"
            />
            <img src={IMAGES.sendMessage} onClick={submitTyping} className='typingSendButton' />
          </form>
        )}
        <div className="icon-container">
          <FaXmark onClick={stopConversation} />
          <IoMdMic onClick={speakToMic} />
          <MdKeyboard onClick={typing} />
        </div>
      </div>
    </div>
  );
}
