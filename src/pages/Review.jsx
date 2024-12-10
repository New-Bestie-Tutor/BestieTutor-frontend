import { Link, useNavigate } from 'react-router-dom';
import Footer from "../components/Footer"
import Header from "../components/Header"
import IMAGES from "../images/images";
import { useContext, useEffect, useState } from 'react';
import { UserContext } from '../UserContext';
import axios from 'axios'; 
import '../App.css'

export default function Review() {
    const navigate = useNavigate();
    const { userInfo } = useContext(UserContext);
    const [conversations, setConversations] = useState([]);
    const [sortOrder, setSortOrder] = useState('latest'); // 'latest' or 'oldest'
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    const fetchConversations = async () => {
        try {
            const userEmail = userInfo?.email;
            if (!userEmail) {
                console.error('이메일 값이 없습니다.');
                return;
            }
            const response = await axios.get(`/conversation/getConversationHistory/${userEmail}`);
            if (response.status === 200) {
                const data = response.data;
                setConversations(data.conversations);
              } else {
                console.error('대화 기록을 가져오는데 실패했습니다.', response.status);
              }
        } catch (error) {
            console.error('Error fetching conversations:', error);
        }
    };
    
    useEffect(() => {
        // 서버에서 대화 목록 가져오기
        fetchConversations();
    }, []);

   // 정렬된 데이터 계산
   const sortedConversations = [...conversations].sort((a, b) => {
    if (sortOrder === 'latest') {
        return new Date(b.startTime) - new Date(a.startTime);
    } else {
        return new Date(a.startTime) - new Date(b.startTime);
    }
});

  // 페이징 처리
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedConversations = sortedConversations.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="Home">
        <Header />
        <div className="container profile-container">
            <h2 className="title">지난 대화 복습하기</h2>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                <select value={sortOrder} onChange={(e) => setSortOrder(e.target.value)}>
                    <option value="latest">최신순</option>
                    <option value="oldest">오래된 순</option>
                </select>
            </div>
            <div>
                {paginatedConversations.map((conversation) => {
                    // topic_description에서 Topic, subTopic, difficulty 추출
                    const [topic, subTopic, difficulty] = conversation.topicDescription.split(' - ');
                    const description = conversation.description;
                    const startTime = new Date(conversation.startTime);
                    const endTime = new Date(conversation.endTime);

                    // 소요 시간 계산 (차이: 밀리초)
                    const durationInMilliseconds = endTime.getTime() - startTime.getTime();

                    // 분, 초로 변환
                    const minutes = Math.floor((durationInMilliseconds % (1000 * 60 * 60)) / (1000 * 60)); // 분
                    const seconds = Math.floor((durationInMilliseconds % (1000 * 60)) / 1000); // 초

                    return (
                        <div key={conversation.conversationId} style={styles.card}>
                            <div style={styles.icon}>
                                <img src={IMAGES[topic]} alt="icon" width="30" />
                            </div>
                            <div>
                                <h3>{topic}</h3>
                                <p>
                                    {subTopic} | {difficulty} | {description}
                                </p>
                                <p>
                                    {`${minutes}분 ${seconds}초`}
                                </p>
                                <p>
                                    {new Date(conversation.startTime).toLocaleString()}
                                </p>
                            </div>
                        </div>
                    );
                })}
            </div>
            <div style={styles.pagination}>
                {Array.from({ length: Math.ceil(conversations.length / itemsPerPage) }, (_, index) => (
                    <button
                        key={index}
                        onClick={() => setCurrentPage(index + 1)}
                        style={{
                            margin: '5px',
                            backgroundColor: currentPage === index + 1 ? '#4caf50' : '#fff',
                            border: '1px solid #ccc',
                        }}
                    >
                        {index + 1}
                    </button>
                ))}
            </div>
        </div>
        <Footer />
    </div>
);
}

// 스타일 예시
const styles = {
card: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '10px',
    padding: '10px',
    border: '1px solid #ddd',
    borderRadius: '8px',
},
icon: {
    marginRight: '10px',
},
pagination: {
    display: 'flex',
    justifyContent: 'center',
    marginTop: '20px',
},
};

