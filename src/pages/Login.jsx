import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../App.css';
import IMAGES from "../images/images";
import { Link } from "react-router-dom";
import GoBack from '../components/GoBack';
import axios from 'axios'; 

export default function Login() {
    const navigate = useNavigate();
    const [email, setEmail] = useState('test1@test1.com');
    const [password, setPassword] = useState('test1test1!');
    const [showPassword, setShowPassword] = useState(false);
    const [redirect, setRedirect] = useState(false);
    //const {setUserInfo} = useContext(UserContext);

    const handleEmailChange = (e) => setEmail(e.target.value);
    const handlePasswordChange = (e) => setPassword(e.target.value);
    const togglePasswordVisibility = () => setShowPassword(!showPassword);

    
    async function login(event) {
      event.preventDefault(); /* 페이지가 변경되지 않도록 막기 */
      console.log('Login function is called');
      const userData = {
        email: email, 
        password: password
      };
      const response = await axios.post('/user/login', userData); 
      console.log("Login response:", response.data);
      if (response.status === 200) {
          navigate('/home');
      }
      else {
        alert('로그인에 실패했습니다.');
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

            <form className="login-form">
                <label htmlFor="email" className="input-label">이메일</label>
                <input
                    type="email"
                    id="email"
                    className="input-field"
                    placeholder="이메일을 입력해주세요."
                    value={email}
                    // value='test1@test1.com'
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
                        // value='test1test1!'
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

                <Link to="/findpw" className="forgot-password">비밀번호를 잊으셨나요?</Link>
                <button type="submit" className="login-button" onClick={login}>로그인</button>

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