import { useNavigate } from 'react-router-dom';
import '../App.css';
import IMAGES from "../images/images";

export default function RegistrationSuccess() {
  const navigate = useNavigate();
    return (
      <div className="container start">
        <div className="image-wrapper">
          <img src={IMAGES.bettu} alt="bettu" className="image" />
          <img src={IMAGES.raebin} alt="raebin" className="image" />
        </div>
        <h2 className="start-title">Bettu와 대화해요!</h2>
        <p className="start-subTitle">선호도 조사는 구현 중...대화 주제 선택 & 대화창 우선 구현</p>
        <button className="button register" onClick={() => navigate('/topic')}>대화주제선택</button>
        <button className="button login" onClick={() => navigate('/conversation')}>대화하기</button>
      </div>
    );
  }