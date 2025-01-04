import { Link } from 'react-router-dom';
import { useNavigate } from "react-router-dom";
import Footer from "../components/Footer"
import Header from "../components/Header"
import IMAGES from "../images/images";
import { useContext, useEffect, useState } from 'react';
import { UserContext } from '../UserContext';
import axios from 'axios'; 
import '../App.css'

export default function About() {
  const navigate = useNavigate();
  const { userInfo } = useContext(UserContext);
  const [user, setUser] = useState({});
  const [topics, setTopics] = useState([]);
  const [text, setText] = useState(''); 
  const message = ' 어떻게 배울까요?'; 
  const typingSpeed = 100; 
  const [isDeleting, setIsDeleting] = useState(false); 
  const [index, setIndex] = useState(0); 


  const handleStartNow = () => {
    navigate("/"); 
  };


  useEffect(() => {
    const handleTyping = () => {
      if (!isDeleting) {
        if (index < message.length) {
          setText((prev) => prev + message[index]); 
          setIndex((prev) => prev + 1); 
        } else {
          setTimeout(() => setIsDeleting(true), 1000); 
        }
      } else {
        if (index > 0) {
          setText((prev) => prev.slice(0, -1)); 
          setIndex((prev) => prev - 1); 
        } else {

          setIsDeleting(false);
        }
      }
    };

    const interval = setInterval(handleTyping, typingSpeed);

    return () => clearInterval(interval); 
  }, [index, isDeleting]);



  useEffect(() => {
    const fetchTopicsAndLockStatus = async () => {
      try {
        const topicsResponse = await axios.get('/topic/');
        setTopics(topicsResponse.data);
      } catch (error) {
        console.error("Failed to fetch topics or lock status:", error);
      }
    };
    fetchTopicsAndLockStatus();
  })

  return (
    <div className="About">
        <Header />
        <div className="about-body">
          <div className="about-container1">
            <p>당신의 절친한 친구가 되어줄,</p>
            <h3>Bestie Tutor</h3>  
          </div>
          <div className="about-container2">
            <p className='fun'>Fun</p>
            <p className='fun_text'>Bestie Tutor는 재밌는 배움을 지향합니다</p>   
          </div>
          <div className="about-container3">
            <div className='about-text3'>
              <p>친구를 사귀면서 언어를 습득하는 방식대로,</p>
              <p>언제 어디서든 당신의 옆에 있어줄 언어 친구</p>
              <p>베튜와 래빈을 소개합니다</p> 
            </div>
            <div className='about-img3'>
              <div className='about-bettu'>
                  <img src={IMAGES.bettu} alt="bettu" className="about_bettu_img" />
                  <p className='bettu_name'>Bettu</p>
                  <p className='bettu_name_tag'>#긍정적인 #활발한</p>
                  <p className='bettu_txt'>베튜는 친근하고 활발한 성격의 캐릭터로, 언제나 긍정적인 에너지를 가지고 있습니다. 학습자가 편안하게 느낄 수 있도록 대화를 이끌어가며, 실수를 격려하고 학습을 지속할 수 있도록 도와줍니다</p>
                </div> 
              <div className='about-raebin'>
                <img src={IMAGES.raebin} alt="raebin" className="about_raebin_img" />
                <p className='raebin_name'>Raebin</p>
                <p className='raebin_name_tag'>#차분한 #신뢰감있는</p>
                <p className='raebin_txt'>래빈은 지적이고 차분한 성격의 캐릭터로, 깊이 있는 대화를 선호합니다. 그는 학습자가 어려운 질문을 던질 때도 함께 고민하며, 다양한 지식을 통해 문제를 해결하는 데 도움을 줍니다.</p>
              </div>
            </div>
          </div>
          <p className='ment'>{text}</p>
          <div className="about-container4">
            <p>단계별 대화 주제로 베튜와 친해지기</p>
            <div className='aboutTopic'>
            {topics.map((topic, index) => (
              <div key={index} className={`about-topic${index + 1}`}>
                <h3>{topic.mainTopic}</h3>
                <ul>
                  {topic.subTopics.map((subTopic, subIndex) => (
                    <li key={subIndex}>{subTopic.name}</li>
                  ))}
                </ul>
              </div>
            ))}
            </div>
          </div>
          <div className="about-container5">
            <img src={IMAGES.자유대화} alt="자유대화" className="freetalkpage" />
            <p>원하는 주제로 베튜와 자유 대화하기</p>
          </div>
          <div className="about-container6">
            <p>베튜의 친절한 피드백</p>
            <img src={IMAGES.피드백} alt="피드백" className="feedbackpage" />
            
          </div>
          <div className="about-container-end">
            <img src={IMAGES.time0} alt="freetalkbetu" className="aboutbettu" />
            <h3>나랑 친구가 되지 않을래?</h3>
            <button className="start-now-btn" onClick={handleStartNow}>
              지금 시작하기
            </button>  
          </div>
        </div>
        <Footer />
    </div>
  );
}
