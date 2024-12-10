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
  const [messages, setMessages] = useState([]);
  const [feedbacks, setFeedbacks] = useState([]);
  const [conversation, setConversation] = useState(null);

  // `converseId`는 나중에 전달된다고 가정
  // const converseId = "6745dd9719cc6b128e61da00"; // 테스트용 하드코딩 값
  const converseId = "6745c2b3b73237fc97ce2438";

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

  // converse_id 로 대화 기록 가져오기 
  useEffect(() => {
    const fetchConversation = async() => {
      try {
        const response = await axios.get(`/conversation/getConversationById/${converseId}`);
        const { conversation } = response.data;

        console.log(conversation);

        // 데이터 설정
        setMessages(conversation.messages);
        setFeedbacks(conversation.feedbacks);
        setConversation({
          topicDescription: conversation.topicDescription,
          startTime: conversation.startTime,
        });
      } catch (error) {
        console.error("Failed to fetch conversation: ", error);
      }
    };

    fetchConversation();
  }, [converseId]);

  // 메시지와 피드백 매핑
  const messagesWithFeedback = messages.map((message) => ({
    ...message,
    feedback: feedbacks.find((fb) => fb.messageId === message.messageId),
  }));
  
  return (
    <div className="container conversation-container">
      {/* 헤더 */}
      <div className="feedback-header">
        <GoBack className="conversation-goBack" />
        <p className="conversation-title">{description}</p>
      </div>

      {/* 대화 내용 */}
      <div className="chat-container">
        {messagesWithFeedback.map((message, index) => (
          <div key={index} className={`message-container 
          ${message.type === "USER" ? "user" : "bot"}`}>
            {/* 메시지 버블 */}
            <div className={`feedback-bubble ${message.type === "USER" ? "user" : "bot"}`}>
              <div className="bubble-text">{message.content}</div>
            </div>

            {/* 피드백 (USER 타입 메시지에만 표시) */}
            {message.type === "USER" && message.feedback && (
              <div className={"chatBubble feedbackBubbleRight"}>
                <p className='userChatText'>{message.feedback.content}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
