import { useNavigate } from 'react-router-dom';
import Footer from "../components/Footer"
import Header from "../components/Header"
import IMAGES from "../images/images";
import { useContext, useEffect, useState } from 'react';
import { UserContext } from '../UserContext';
import axios from 'axios'; 
import RecordCard from "../components/RecordCard";
import '../App.css'

export default function Review() {
    const navigate = useNavigate();
    const { userInfo } = useContext(UserContext);
    const [conversations, setConversations] = useState([]);
    const [sortOrder, setSortOrder] = useState('latest');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    const fetchConversations = async () => {
        try {
            const userEmail = userInfo?.email;
            if (!userEmail) {
                // console.error('이메일 값이 없습니다.');
                return;
            }
            const response = await axios.get(`/conversation/${userEmail}/history`);
            if (response.status === 200) {
                const data = response.data;
                setConversations(data.conversations);
              } else {
                // console.error('대화 기록을 가져오는데 실패했습니다.', response.status);
              }
        } catch (error) {
            // console.error('Error fetching conversations:', error);
        }
    };
    
    useEffect(() => {
        fetchConversations();
    }, []);

   // 데이터 정렬
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

//   const reviewHandler = (conversationId, description) => {
//     navigate('/feedback', { state: { conversationId, description } }); 
//   };

  return (
    <div className="Home">
        <Header />
        <div className="container profile-container">
            <h2 className="review-title">지난 대화 복습하기</h2>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                <select className='sortOrderBox' value={sortOrder} onChange={(e) => setSortOrder(e.target.value)}>
                    <option value="latest">최신순</option>
                    <option value="oldest">오래된 순</option>
                </select>
            </div>
            <div>
                {paginatedConversations.map((conversation) => {
                    const [topic, subTopic, difficulty] = conversation.topicDescription.split(' - ');
                    const description = conversation.description;
                    const startTime = new Date(conversation.startTime);
                    const endTime = new Date(conversation.endTime);

                    const durationInMilliseconds = endTime.getTime() - startTime.getTime();

                    const minutes = Math.floor((durationInMilliseconds % (1000 * 60 * 60)) / (1000 * 60)); // 분
                    const seconds = Math.floor((durationInMilliseconds % (1000 * 60)) / 1000); // 초

                    return (
                        <div className='review-card'>
                            <RecordCard
                        key={conversation.conversationId}
                        record={{...conversation}}
                        />
                        </div>
                    );
                })}
            </div>
            <div className='review-pagination'>
                {Array.from({ length: Math.ceil(conversations.length / itemsPerPage) }, (_, index) => {
                    const pageIndex = index + 1;
                    return (
                        <button
                            className={`review-pagination-button ${currentPage === pageIndex ? 'active' : ''}`}
                            key={index}
                            onClick={() => setCurrentPage(pageIndex)}
                        >
                            {pageIndex}
                        </button>
                    );
                })}
            </div>
        </div>
        <Footer />
    </div>
);
}

