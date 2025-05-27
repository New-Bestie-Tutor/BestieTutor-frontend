import GoBack from '../components/GoBack';
import IMAGES from '../images/images';
import '../App.css';
import { useState, useEffect, useRef, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';


export default function Feedback() {
  const [messages, setMessages] = useState([]);
  const [feedbacks, setFeedbacks] = useState([]);
  const [conversation, setConversation] = useState(null);
  const location = useLocation();
  const { 
    mainTopic, 
    selectedSubTopic, 
    selectedLevel, 
    description, 
    selectedCharacter,
    conversationId
  } = useMemo(() => ({
      mainTopic: location.state?.mainTopic,
      selectedSubTopic: location.state?.selectedSubTopic,
      selectedLevel: location.state?.selectedLevel,
      description: location.state?.description,
      selectedCharacter: location.state?.selectedCharacter,
      conversationId: location.state?.conversationId
  }), [location.state]);

  useEffect(() => {
  console.log("location.state:", location.state);
}, [location.state]);

  // 기본 이미지 설정
  const characterImage = selectedCharacter 
    ? IMAGES[selectedCharacter] 
    : IMAGES['bettu'];

  // 대화 기록 조회
  useEffect(() => {
    const fetchConversation = async() => {
      try {
        const response = await axios.get(`/conversation/${conversationId}`);
        const { conversation } = response.data;

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
  }, [conversationId]);

  // 메시지와 피드백 매핑
  const messagesWithFeedback = messages.map((message) => ({
    ...message,
    feedback: feedbacks.find((fb) => fb.messageId === message.messageId),
  }));
  
  return (
    <div className="container conversation-container">
      {/* 헤더 */}
      <div className="conversation-header">
        <GoBack className="conversation-goBack" />
        <p className="conversation-title">{description}</p>
      </div>

      {/* 대화 내용 */}
      <div className="chat-container">
        {messagesWithFeedback.map((message, index) => (
          <div key={index} className={`message-container ${message.type === "USER" ? "user" : "bot"}`}>
            {/* bot 메시지일 때 이미지 추가 */}
            {message.type === 'BOT' && (
              <div className="chatMessage">
                <img
                  src={characterImage}
                  alt={selectedCharacter}
                  className="image chatImage"
                />
                <div className="chatBubble">
                  <div className="bettuChatText">{message.content}</div>
                </div>
              </div>
            )}

            {/* USER 메시지 버블 */}
            {message.type === 'USER' && (
              <div className="chatBubble chatBubbleRight">
                <div className="userChatText">{message.content}</div>
              </div>
            )}

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
