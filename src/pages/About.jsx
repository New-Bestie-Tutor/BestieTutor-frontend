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

  const levelData = [
    {
      step: '1단계',
      topic: '가볍고 일상적인 대화 위주',
      question: 'What is your favorite season?',
      answer: 'I like winter!',
      tags: ['#자기소개', '#일상루틴', '#관심사']
    },
    {
      step: '2단계',
      topic: '개인적인 관심사 위주',
      question: 'Tell me the best experience you’ve had this year.',
      answer: 'I did well on my exam and got 5th place in my school!',
      tags: ['#특별한 경험', '#여행', '#취미']
    },
    {
      step: '3단계',
      topic: '과거 경험 공유 위주',
      question: 'Tell me what you’ve had a hard time in your life, and what you’ve learned from it.',
      answer: 'I was almost in a car accident when I was young, so I’m still scared when I see a car.',
      tags: ['#소중한 사람들', '#감정 나누기', '#도전과 극복']
    },
    {
      step: '4단계',
      topic: '미래 이야기 위주',
      question: 'What is your dream and goal that you want to be in the future?',
      answer: 'My goal is to become a police officer and be a person who can protect citizens from bad people.',
      tags: ['#꿈과 목표', '#나의 가치관', '#새로운 도전']
    }
  ];
  
  return (
    <div className="About">
      <Header />
      <div className="about-body">
        <div className="about-container1">
          <div className="intro-text">
            <h3>BESTIE TUTOR</h3>
            <p className='한줄소개'><strong>Learning AI with Foreign Friends</strong></p>
            <p>BESTIE TUTOR는 개인 지도교사이자 절친한 친구라는 의미의 서비스입니다.</p>
            <p>당신이 원하고 배우고 싶은 언어를 즐겁게 배울 수 있도록 열심히 도와줄 것입니다.</p>
          </div>
          <div className="intro-images">
            <img src={IMAGES.bettu} alt='intro-bettu' />
            <img src={IMAGES.raebin} alt='intro-raebin' />
          </div>
        </div>
        
        <div className="about-container2">
          <div className="fun-images">
            <img src={IMAGES.fun1} alt="fun1" />
          </div>
          <div className="fun-text-box">
            <p>The Core Value of BESTIE TUTOR</p>
            <p className="fun">FUN</p>
            <p className="fun_text">베튜와 함께<br></br>즐겁게 외국어 공부를 하는 것</p>
          </div>
          <div className="fun-images">
            <img src={IMAGES.fun2} alt="fun2" />
          </div>
        </div>

        <div className="about-container3">
          <h5 className="intro-label">Level</h5>
          <h2 className="intro-title">단계별 대화 진행</h2>
          <div className="level-grid">
            {levelData.map((item, index) => (
              <div className="level-card" key={index}>
                <div className="chat-box">
                  <div className="bubble question full">{item.question}</div>
                  <div className="bubble answer full">{item.answer}</div>
                </div>
                <div className="level-info">
                  <h5 style={{ fontSize: '14px', margin: '6px 0' }}>{item.step}</h5>
                  <p className="level-subtitle" style={{ fontWeight: '600', fontSize: '16px' }}>{item.topic}</p>
                  <div className="tags">
                    {item.tags.map((tag, i) => <span key={i}>{tag}</span>)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="about-container4">
          <h5 className="intro-label">Advantages of BESTIE TUTOR</h5>
          <h3 className="intro-title">BESTIE TUTOR의 장점</h3>
          <div className="advantages">
            <div className="advantages-buttons">
              <button>원하는 주제로 자유롭게 대화하기</button>
              <button>AI 학습을 통한 친절한 피드백</button>
              <button>마피아 게임을 통한 언어 능력 향상</button>
            </div>
            <img src={IMAGES.feedback} alt="feedback sample" className="advantage-image" />
          </div>
        </div>

        <div className="about-container5">
          <h5 className="intro-label">Introduction of Characters</h5>
          <h3 className="intro-title">캐릭터 소개</h3>
          <div className="character-list">
            {[{
              name: "Bettu",
              desc: "#긍정적인 #외향적인",
              role: "부담없는 상담과 함께 친근하게 대화해요!",
              tone: "항상 긍정적이며, 실수를 학습의 일부분으로 여기게끔 도와드려요."
            }, {
              name: "Raebin",
              desc: "#차분한 #신뢰감있는",
              role: "침착한 목소리로 천천히 생각하며 대화해요.",
              tone: "학습자가 스스로 고민할 수 있도록 유도하며, 필요한 상황에는 명확한 도움을 줍니다."
            }, {
              name: "Bambi", desc: "#긍정적인 #외향적인", role: "부담없는 상담과 함께 친근하게 대화해요!", tone: "항상 긍정적이며, 실수를 학습의 일부분으로 여기게끔 도와드려요." },
              { name: "Tiron", desc: "#긍정적인 #외향적인", role: "부담없는 상담과 함께 친근하게 대화해요!", tone: "항상 긍정적이며, 실수를 학습의 일부분으로 여기게끔 도와드려요." },
              { name: "Beary", desc: "#긍정적인 #외향적인", role: "부담없는 상담과 함께 친근하게 대화해요!", tone: "항상 긍정적이며, 실수를 학습의 일부분으로 여기게끔 도와드려요." },
              { name: "Marin", desc: "#긍정적인 #외향적인", role: "부담없는 상담과 함께 친근하게 대화해요!", tone: "항상 긍정적이며, 실수를 학습의 일부분으로 여기게끔 도와드려요." }
            ].map((char, idx) => (
              <div key={idx} className="character-box">
                <div className="character-info">
                  <h4>{char.name}</h4>
                  <p>{char.desc}</p>
                </div>
                <img src={IMAGES[char.name.toLowerCase()]} alt={char.name} className="character-image" />
                <div className="character-meta">
                  <p><strong>말투</strong><br />{char.role}</p>
                  <br />
                  <p><strong>태도</strong><br />{char.tone}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="about-container-end">
          <p>베튜와 함께하는 대화를 통해<br />외국어 실력을 쑥쑥 성장시켜보아요!</p>
          <img src={IMAGES.bettu} alt="bettu" />
          <button onClick={() => navigate('/')}>BESTIE TUTOR 시작하기</button>
        </div>
      </div>
      <Footer />
    </div>
  );
}
