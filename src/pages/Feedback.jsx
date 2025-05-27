import GoBack from '../components/GoBack';
import IMAGES from '../images/images';
import '../App.css';
import { useState, useEffect, useMemo } from 'react';
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
    conversationId,
  } = useMemo(() => ({
    mainTopic: location.state?.mainTopic,
    selectedSubTopic: location.state?.selectedSubTopic,
    selectedLevel: location.state?.selectedLevel,
    description: location.state?.description,
    selectedCharacter: location.state?.selectedCharacter,
    conversationId: location.state?.conversationId,
  }), [location.state]);

  useEffect(() => {
    console.log("location.state:", location.state);
  }, [location.state]);

  const characterImage = selectedCharacter
    ? IMAGES[selectedCharacter]
    : IMAGES['bettu'];

  // 대화 기록 조회
  useEffect(() => {
    const fetchConversation = async () => {
      try {
        const response = await axios.get(`/conversation/${conversationId}`);
        const { conversation } = response.data;

        setMessages(conversation.messages);
        setFeedbacks(conversation.feedbacks);
        setConversation({
          topicDescription: conversation.topic_description,
          startTime: conversation.start_time,
        });
      } catch (error) {
        console.error("Failed to fetch conversation: ", error);
      }
    };

    if (conversationId) fetchConversation();
  }, [conversationId]);

  // 메시지와 피드백 매핑
  const messagesWithFeedback = messages.map((message) => ({
    ...message,
    feedback: feedbacks.find((fb) => fb.message_id === message.message_id),
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
          <div key={index} className={`message-container ${message.message_type === "USER" ? "user" : "bot"}`}>
            {/* BOT 메시지 */}
            {message.message_type === 'BOT' && (
              <div className="chatMessage">
                <img
                  src={characterImage}
                  alt={selectedCharacter}
                  className="image chatImage"
                />
                <div className="chatBubble">
                  <div className="bettuChatText">{message.message}</div>
                </div>
              </div>
            )}

            {/* USER 메시지 */}
            {message.message_type === 'USER' && (
              <div className="chatBubble chatBubbleRight">
                <div className="userChatText">{message.message}</div>
              </div>
            )}

            {/* 피드백 */}
            {message.message_type === "USER" && message.feedback && (
              <div className="chatBubble feedbackBubbleRight">
                <p className="userChatText">{message.feedback.feedback}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
