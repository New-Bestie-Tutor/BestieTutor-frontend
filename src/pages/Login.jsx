import React, { useContext, useState } from 'react';
import { UserContext } from "../UserContext";
import { useNavigate } from 'react-router-dom';
import '../App.css';
import IMAGES from "../images/images";
import { Link } from "react-router-dom";
import GoBack from '../components/GoBack';
import axios from 'axios'; 

export default function Login() {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [errorMessage, setErrorMessage] = useState(''); // State for error message
    const { setUserInfo } = useContext(UserContext);

    const handleEmailChange = (e) => setEmail(e.target.value);
    const handlePasswordChange = (e) => setPassword(e.target.value);
    const togglePasswordVisibility = () => setShowPassword(!showPassword);

    const handleFocus = (field) => {
      if (field === 'email' && email === 'test1@test1.com') {
          setEmail('');
      }
      if (field === 'password' && password === 'test1test1!') {
          setPassword('');
      }
    };

    async function login(event) {
      event.preventDefault(); 
      setErrorMessage(''); 
      const userData = { email, password };

      try {
        const response = await axios.post('/user/login', userData, { withCredentials: true });
        
        if (response.status === 200) {
          setUserInfo(response.data);
          navigate(response.data.redirectUrl || '/home');
        }
      } catch (error) {
        if (error.response && error.response.status === 401) {
          setErrorMessage('아이디 또는 비밀번호가 잘못되었습니다.'); 
        } else {
          setErrorMessage('로그인에 실패했습니다. 다시 시도해주세요.');
        }
        console.error("Login error:", error);
      }
    }

    /***카카오로그인***/
    const kakaoLoginUrl = 'http://localhost:3000/user/login/kakao';
    const handleKakaoLogin = () => {
      window.location.href = kakaoLoginUrl;
      console.log('카카오로그인 입장');
    }; 

    return (
        <div className="login-container">
            <GoBack /> 
            <h1 className="login-title">로그인</h1>
            <p className="login-subtitle">이메일로 로그인해 주세요</p>

            <form className="login-form" onSubmit={login}>
                <label htmlFor="email" className="input-label">이메일</label>
                <input
                    type="email"
                    id="email"
                    className="input-field"
                    placeholder="이메일을 입력해주세요."
                    value={email}
                    onFocus={() => handleFocus('email')}
                    onChange={handleEmailChange}
                />

                <label htmlFor="password" className="input-label">비밀번호</label>
                <div className="password-container">
                    <input
                        type={showPassword ? "text" : "password"}
                        id="password"
                        className="input-field"
                        placeholder="비밀번호를 입력해주세요"
                        value={password}
                        onFocus={() => handleFocus('password')}
                        onChange={handlePasswordChange}
                    />
                    <button
                        type="button"
                        className="password-toggle"
                        onClick={togglePasswordVisibility}
                    >
                        {showPassword ? '🙈' : '🙉'}
                    </button>
                </div>

                {/* Error message display */}
                {errorMessage && <p className="login-error-message">{errorMessage}</p>}

                <Link to="/findpw" className="forgot-password">비밀번호를 잊으셨나요?</Link>
                <button type="submit" className="login-button">로그인</button>

                <p className="signup-text">
                    계정이 없으신가요? <Link to="/register" className="signup-link">계정만들기</Link>
                </p>

                <div className="divider">Or with</div>

                <button type="button" className="kakao-login" onClick={handleKakaoLogin}>
                  <img src={IMAGES.kakao_login} alt="kakao_login" className="kakao-login_image" />
                </button>
            </form>
        </div>
    );
}
