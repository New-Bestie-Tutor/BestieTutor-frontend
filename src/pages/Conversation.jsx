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
                        베튜가 말합니다.
                    </div>
                </div>
                <div className='chatBubble chatBubbleRight'>
                    <div className='userChatText'>
                        min-width: 200px;: 최소 너비를 설정하여 내용이 너무 작아지지 않도록 합니다.
                        max-width: 80%;: 최대 너비를 설정하여 브라우저의 너비에 따라 자동으로 줄어들 수 있도록 합니다. 
                        필요에 따라 이 값을 조정할 수 있습니다.
                    </div>
                </div>
                <div className='bettuChatText'>
                    <img src={IMAGES.bettu} alt="bettu" className="image chatImage" />
                    <div className='chatBubble'>
                        베튜가 말합니다.
                    </div>
                </div>
                <div className='chatBubble chatBubbleRight'>
                    <div className='userChatText'>
                        min-width: 200px;: 최소 너비를 설정하여 내용이 너무 작아지지 않도록 합니다.
                        max-width: 80%;: 최대 너비를 설정하여 브라우저의 너비에 따라 자동으로 줄어들 수 있도록 합니다. 
                        필요에 따라 이 값을 조정할 수 있습니다.
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