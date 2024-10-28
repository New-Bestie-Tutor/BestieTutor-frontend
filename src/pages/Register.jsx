import { useNavigate } from 'react-router-dom';
import '../App.css';

export default function Register() {
    const navigate = useNavigate();
        return (
          <div className="container">
            <h2 className="start-title">회원가입</h2>
            <p className="start-subTitle">좋은 말 할 때 정보 입력해라 개인정보 내놔</p>
            <button className="button login" onClick={() => navigate('/login')}>다음</button>
          </div>
        );
}