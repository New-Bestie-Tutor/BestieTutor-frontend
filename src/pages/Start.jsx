import React from "react";
import { useNavigate } from 'react-router-dom';
import '../App.css';
import IMAGES from "../images/images";

export default function Start() {
  const navigate = useNavigate();
    return (
      <div className="start-container">
        <div className="image-wrapper">
          <img src={IMAGES.bettu} alt="bettu" className="image" />
          <img src={IMAGES.raebin} alt="raebin" className="image" />
        </div>
        <h2 className="start-title">Bestie Tutor</h2>
        <p className="start-subTitle">베튜와 함께 언어공부해요</p>
        <button className="register" onClick={() => navigate('/register')}>회원가입</button>
        <button className="login" onClick={() => navigate('/login')}>로그인</button>
      </div>
    );
  }