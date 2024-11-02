import { useNavigate } from 'react-router-dom';
import GoBack from '../components/GoBack';
import IMAGES from '../images/images';
import { IoMdMic } from "react-icons/io";
import { MdKeyboard } from "react-icons/md";
import { FaXmark } from "react-icons/fa6";
import '../App.css';

export default function Conversation() {
  const navigate = useNavigate();
  const stopConversation = () => {
    alert('대화를 종료합니다.');
  } 
  const speakToMic = () => {
    alert('마이크가 켜졌습니다.');
  } 
  const typing = () => {
    alert('문자를 입력해주세요.');
  } 
  
    return (
        <div className="container">
            <GoBack /> 
            <h2 className="conversation-title">가족 소개하기</h2>
            <div className='chat-container'>
                <div className='bettuChatText'>
                    <img src={IMAGES.bettu} alt="bettu" className="image chatImage" />
                    <div className='chatBubble'>
                        안녕하세요, 수염! 오늘 내 가족에 대해 이야기해줄게요. 저희 가족은 총 네 명이에요.
                    </div>
                </div>
                <div className='chatBubble chatBubbleRight'>
                    <div className='userChatText'>
                        안녕하세요, 베튜! 네 명이라니, 가족이 궁금하네요. 누가 있나요?
                    </div>
                </div>
                <div className='bettuChatText'>
                    <img src={IMAGES.bettu} alt="bettu" className="image chatImage" />
                    <div className='chatBubble'>
                        저희 부모님과 남동생이 있어요. 아버지는 회사원이고, 어머니는 전업주부세요. 그리고 남동생은 중학생이에요.
                    </div>
                </div>
                <div className='chatBubble chatBubbleRight'>
                    <div className='userChatText'>
                        아, 그렇군요! 아버지와 어머니는 어떤 취미가 있으세요?
                    </div>
                </div>
            </div>
            <div className='userChatInput'>
                <FaXmark onClick={stopConversation} />
                <IoMdMic onClick={speakToMic}/>
                <MdKeyboard onClick={typing}/>
            </div>
        </div>
    );
  }