import { useNavigate, useLocation } from 'react-router-dom';
import Footer from "../components/Footer";
import Header from "../components/Header";
import { useContext, useEffect, useState } from 'react';
import { UserContext } from '../UserContext';
import axios from 'axios';
import IMAGES from '../images/images';
import '../App.css'
import '../css/ReviewLayout.css';

export default function Review() {
  const navigate = useNavigate();
  const location = useLocation();
  const { userInfo } = useContext(UserContext);
  const [conversations, setConversations] = useState([]);
  const preselectedConversation = location.state?.selectedConversation || null;
  const [selectedConversation, setSelectedConversation] = useState(pre);
  const [conversationDetail, setConversationDetail] = useState({ messages: [], feedbacks: [] });

  /* 전체 대화 목록 */
  const fetchConversations = async () => {
    try {
        if (!(userInfo?.email)) return;
        const res = await axios.get(`/conversation/${userInfo.email}/history`);
        setConversations(res.data.conversations);
    } catch (error) {
        console.error("전체 대화 목록을 불러오는 데 실패했습니다.: ", error);
    }
  };

  useEffect(() => {
    fetchConversations();
  }, []);

  /* 선택된 대화 상세 가져오기 */
  useEffect(() => {
  const fetchConversationDetail = async () => {
    if (!selectedConversation) return;
    try {
        const res = await axios.get(`/conversation/${selectedConversation.converse_id}`);
        const { messages, feedbacks } = res.data.conversation;
        
        const messagesWithFeedback = messages.map((msg) => ({
            ...msg,
            feedback: feedbacks.find((fb) => fb.message_id === msg.message_id),
        }));

        setConversationDetail({ messages: messagesWithFeedback });
    } catch (error) {
      console.error("대화 상세 정보를 불러오는 데 실패했습니다:", err);
    }
  };

  fetchConversationDetail();
}, [selectedConversation]);
  
  /* 일자별로 그룹화 */
  const grouped = conversations.reduce((acc, convo) => {
    const date = new Date(convo.start_time).toISOString().split('T')[0];
    if (!acc[date]) acc[date] = [];
    acc[date].push(convo);
    return acc;
  }, {});

  return (
    <>
      <Header />
      <div className="split-layout">
        <div className="sidebar">
          {/* 사이드바 콘텐츠 */}

          {Object.entries(grouped).map(([date, list]) => (
            <div key={date} className="conversation-group">
              <h4>{date}</h4>
              {list.map((conv) => (
                <div 
                    key={conv.converse_id} 
                    className="conversation-item"
                    onClick={() => setSelectedConversation(conv)}
                >
                  <p>{conv.description}</p>
                  <span>{((new Date(conv.end_time) - new Date(conv.start_time)) / 60000).toFixed(1)}분</span>
                </div>
              ))}
            </div>
          ))}
        </div>
         <div className="main-panel">
          {/* 메인 콘텐츠 */}

          {!selectedConversation ? (
            <p className="placeholder-text">대화를 선택해 주세요.</p>
          ) : (
            <>
              <div className="chat-header">
                <p className="chat-title">{selectedConversation.description}</p>
              </div>

              {!conversationDetail ? (
                <p className="placeholder-text">대화 내용을 불러오는 중입니다...</p>
              ) : (
                
                <div className="chat-container">
                  {conversationDetail.messages.map((message, index) => (
                    <div
                      key={index}
                      className={`message-container ${message.message_type === "USER" ? "user" : "bot"}`}
                    >
                      {/* BOT 메시지 */}
                      {message.message_type === 'BOT' && (
                        <div className="chatMessage">
                          <img
                            src={IMAGES[selectedConversation.selected_character] || IMAGES['bettu']}
                            alt={selectedConversation.selected_character}
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
              )}
            </>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}
