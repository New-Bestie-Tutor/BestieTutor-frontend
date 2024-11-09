import { useNavigate } from 'react-router-dom';
import '../App.css';
import IMAGES from "../images/images";
import GoBack from '../components/GoBack';

export default function RegistrationSuccess() {
  const navigate = useNavigate();
    return (
      <div className="container start">
        <GoBack className="goBack"/>
        <div className="image-wrapper">
          <img src={IMAGES.bettu} alt="bettu" className="image" />
          <img src={IMAGES.raebin} alt="raebin" className="image" />
        </div>
        <h2 className="start-title">회원가입이 완료되었습니다!</h2>
        <p className="start-subTitle">이제 베튜와 함께 즐겁게 학습 여정을 시작해보세요!</p>
        <button className="button register" onClick={() => navigate('/login')}>로그인 하기</button>
      </div>
    );
  }