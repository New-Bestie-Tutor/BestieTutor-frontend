import React, { useState } from 'react';
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
    const [redirect, setRedirect] = useState(false);
    //const {setUserInfo} = useContext(UserContext);

    const handleEmailChange = (e) => setEmail(e.target.value);
    const handlePasswordChange = (e) => setPassword(e.target.value);
    const togglePasswordVisibility = () => setShowPassword(!showPassword);

    
    async function login(event) {
      event.preventDefault(); /* 페이지가 변경되지 않도록 막기 */
      const response = await fetch("http://localhost:7777/login", {
        method: "POST",
        body: JSON.stringify({email, password}),
        headers: {'Content-Type': 'application/json'},
        credentials: 'include',
      });
      if (response.status === 200) {
        response.json().then(userInfo => {
          setUserInfo(userInfo);
          alert('로그인에 성공했습니다.');
          setRedirect(true);
        })
      }
      else {
        alert('로그인에 실패했습니다.');
      }
    }
    /* React의 상태 관리를 통해 redirect가 true가 되는 순간 이동 */
    if (redirect) {
      return <Navigate to={'/home'} />
    }
    
    /***카카오로그인***/
    //카카오 로그인 이동페이지 주소
    //const authUrl = `https://kauth.kakao.com/oauth/authorize?client_id=${process.env.KAKAO_CLIENT_ID}&redirect_uri=${redirectUri}&response_type=code`;

    
    const kakaoLoginUrl = 'http://localhost:3000/user/login/kakao';
    const handleKakaoLogin = () => {
      window.location.href = kakaoLoginUrl;
      console.log('카카오로그인 입장');
  }; 
/*
  async function loginWithKakao() {
    try {
      // 서버에 로그인 API 요청
      const response = await axios.get('/user/login/kakao');
      
      // 카카오 로그인 URL로 리디렉션
      window.location.href = response.request.responseURL;
    } catch (error) {
      console.error("Kakao login error:", error);
    }
  }
    */
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
                    placeholder="bread.su@gmail.com"
                    value={email}
                    onChange={handleEmailChange}
                />

                <label htmlFor="password" className="input-label">비밀번호</label>
                <div className="password-container">
                    <input
                        type={showPassword ? "text" : "password"}
                        id="password"
                        className="input-field"
                        placeholder="bread1011"
                        value={password}
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
