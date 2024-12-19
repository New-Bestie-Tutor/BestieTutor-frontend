import { Link } from 'react-router-dom';
import Footer from "../components/Footer"
import Header from "../components/Header"
import IMAGES from "../images/images";
import { useContext, useEffect, useState } from 'react';
import { UserContext } from '../UserContext';
import axios from 'axios'; 
import '../App.css'

export default function MyPage() {
  const { userInfo } = useContext(UserContext);
  const [user, setUser] = useState({});
  const [totalTime, setTotalTime] = useState(0);
  const [recentLanguage, setRecentLanguage] = useState([]);
  const [currentStep, setCurrentStep] = useState(0);
  const steps = [10, 30, 60, 120];

const fetchUser = async () => {
    try {
        const userId = userInfo?.userId;
        const response = await axios.get('/user/getUser', {
            params: { userId },
        });
    if (response.status === 200) {
        setUser(response.data);
        setTotalTime(response.data.total_time);
    } else {
        // console.error("userId 불러오는데 실패했습니다.", response.status);
    }
    } catch (error) {
    // console.error("API 호출 오류:", error);
    }
};

const getRecentLanguage = async () => {
    try {
        const userEmail = userInfo?.email;
        const response = await axios.get(`/conversation/getRecentLanguage/${userEmail}`);
        if (response.status === 200) {
            const conversation = response.data.conversation;

            if (conversation) {
              switch (conversation.selected_language) {
                case 'English':
                  setRecentLanguage("English"); 
                  break;
                case 'Korean':
                  setRecentLanguage("한국어"); 
                  break;
                default:
                  setRecentLanguage("대화하자!");
                  break;
              }
            } else {
                setRecentLanguage(null);
            }
          } else {
            // console.error('언어 기록을 가져오는데 실패했습니다.', response.status);
          }
    } catch (error) {
        // console.error('Error fetching RecentLanguage:', error);
    }
  };
  
  useEffect(() => {
    if (userInfo?.userId) { 
        fetchUser();  
      }
    if (userInfo?.email) {
      getRecentLanguage();
    }
  }, [userInfo]);

  

  return (
    <div className="Home">
        <Header />
        <div className="mypage-container">
            <div className="profile-header">
                <img src={IMAGES.bettu} alt="mypage Profile" className="mypage-profile" />
                <h2 className="user-name">{user ? user.nickname : "Guest"}</h2>
                <div className="profile-stats">
                <div className="stat">{recentLanguage}<br /><span>최근 언어</span></div>
                <div className="stat">{totalTime.toFixed(1)}<br /><span>누적 대화시간</span></div>
                <div className="stat">LV.{currentStep+1}<br /><span>친밀도</span></div>
                </div>
            </div>  
            <ul className="mypage-menu">
                <Link to="/profile"><li><span>👤</span>회원 정보 수정</li></Link>
                <Link to="/review"><li><span>💬</span>지난 대화 복습하기</li></Link>
                <Link to="/premium"><li><span>👑</span>프리미엄 업그레이드</li></Link>
                <Link to="/settings"><li><span>⚙️</span>설정</li></Link>
                <Link to="/inquiry"><li><span>❓</span>문의하기</li></Link>
                <Link to="/about"><li><span><img src={IMAGES.bettu} alt="Mascot" className="mypage-service" /></span>Bestie Tutor 서비스 소개</li></Link>
            </ul>
        </div>
        <Footer />
    </div>
  );
}
