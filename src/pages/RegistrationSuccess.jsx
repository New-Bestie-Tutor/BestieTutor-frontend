import { useNavigate } from 'react-router-dom';
import '../App.css';
import IMAGES from "../images/images";
import GoBack from '../components/GoBack';

export default function RegistrationSuccess() {
  const navigate = useNavigate();
  return (
    <div className="success-modal-overlay">
      <div className="success-modal">
        <img src={IMAGES.check} alt="check-icon" className="check-icon" />
        <h3 className="success-modal-title">회원가입이 완료되었습니다!</h3>
        <p className="success-modal-subtitle">이제 베튜와 함께 학습 여정을 시작해보세요!</p>
        <button className="success-modal-button" onClick={() => navigate('/login')}>로그인하기</button>
      </div>
    </div>
  );
}