import { useNavigate } from 'react-router-dom';
import '../App.css';

export default function Login() {
    const navigate = useNavigate();
        return (
          <div className="start-container">
            <h2 className="start-title">로그인</h2>
            <p className="start-subTitle">정보 내놔</p>
            <button className="login" onClick={() => navigate('/register')}>다음</button>
          </div>
        );
}