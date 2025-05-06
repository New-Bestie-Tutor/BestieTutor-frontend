import React, { useContext, useState, useEffect } from 'react';
import { UserContext } from "../UserContext";
import { useNavigate } from 'react-router-dom';
import '../App.css';
import IMAGES from "../images/images";
import { Link } from "react-router-dom";
import axios from 'axios';

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const { setUserInfo } = useContext(UserContext);

  const handleEmailChange = (e) => setEmail(e.target.value);
  const handlePasswordChange = (e) => setPassword(e.target.value);
  const togglePasswordVisibility = () => setShowPassword(!showPassword);

  const handleFocus = (field) => {
    if (field === 'email') {
      setEmail('');
    }
    if (field === 'password') {
      setPassword('');
    }
  };

  // 일반 로그인
  async function login(event) {
    event.preventDefault();
    setErrorMessage('');
    const userData = { email, password };

    try {
      const response = await axios.post('/user/login', userData, { withCredentials: true });

      if (response.status === 200) {
        // accessToken 로컬 스토리지에 저장
        localStorage.setItem('accessToken', response.data.accessToken);

        setUserInfo(response.data.user);
        navigate(response.data.redirectUrl || '/home');
      }
    } catch (error) {
      if (error.response && error.response.status === 401) {
        setErrorMessage('아이디 또는 비밀번호가 잘못되었습니다.');
      } else {
        setErrorMessage('로그인에 실패했습니다. 다시 시도해주세요.');
      }
      // console.error("Login error:", error);
    }
  }

  // 카카오 로그인 요청
  const kakaoLoginUrl = `${import.meta.env.VITE_API_BASE_URL}/user/login/kakao`;
  const handleKakaoLogin = () => {
    window.location.href = kakaoLoginUrl;
  };

  // 콜백 처리
  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);
    const code = queryParams.get('code');

    if (code) {
      handleKakaoCallback(code);
      // URL에서 `code` 제거
      window.history.replaceState(null, '', window.location.pathname);
    }
  }, []);

  // 카카오 로그인 콜백
  async function handleKakaoCallback(code) {
    try {
      const response = await axios.get('/user/login/kakao/callback?code=' + code);

      if (response.status === 200) {
        const { accessToken, user, redirectUrl } = response.data;

        // 로컬 스토리지에 토큰 저장
        localStorage.setItem('accessToken', accessToken);

        // 사용자 정보 업데이트
        setUserInfo(user);
        navigate(redirectUrl);
      }
    } catch (error) {
      // console.error('카카오 로그인 실패:', error);
      alert('로그인에 실패했습니다. 다시 시도해주세요.');
      navigate('/login'); // 실패 시 로그인 페이지로 이동
    }
  }

  return (
    <div className="login-container">
      <h1 className="login-title">BESTIE TUTOR</h1>
      <p className="login-subtitle">베튜와 함께 외국어 공부해요!</p>
      <form className="login-form" onSubmit={login}>
        <label htmlFor="email" className="input-label">아이디</label>
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
            {showPassword ? '👁️‍🗨️' : '👁️'}
          </button>
        </div>
        {errorMessage && <p className="login-error-message">{errorMessage}</p>}
        <Link to="/findpw" className="forgot-password">비밀번호를 잊으셨나요?</Link>
        <button type="submit" className="login-button">로그인하기</button>
        <button className="button register" onClick={() => navigate('/userAgreement')}>회원가입</button>
        <button type="button" className="kakao-login" onClick={handleKakaoLogin}>
          <img src={IMAGES.kakao_login} alt="kakao_login" className="kakao-login_image" />
        </button>
      </form>
    </div>
  );
}
