import React, { useState } from 'react';
import '../App.css';
import { FaInstagram, FaYoutube, FaCommentDots } from 'react-icons/fa';

const Footer = () => {
    const [showBusinessInfo, setShowBusinessInfo] = useState(false);

    const toggleBusinessInfo = () => {
        setShowBusinessInfo(!showBusinessInfo);
    };

    return (
        <footer className="footer">
            <div className="footer-container">
                <div className="footer-top">
                    <div className="footer-title">
                        <span>(주) Bestie Tutor</span>
                    </div>
                    <div className="footer-icons">
                        <FaInstagram className="icon" />
                        <FaYoutube className="icon" />
                        <FaCommentDots className="icon" />
                    </div>
                </div>
                <div className="footer-info-toggle" onClick={toggleBusinessInfo}>
                    사업자 정보 펼쳐보기 {showBusinessInfo ? '▲' : '▼'}
                </div>
                {showBusinessInfo && (
                    <div className="footer-business-info">
                        <p>사업자 등록번호: 123-45-67890</p>
                        <p>대표자: 홍길동</p>
                        <p>주소: 서울특별시 강남구 테헤란로 123</p>
                    </div>
                )}
                <div className="footer-links">
                    <a href="#">이용약관</a>
                    <a href="#">개인정보처리방침</a>
                    <a href="#">고객센터</a>
                    <a href="#">환불신청</a>
                    <a href="#">B2B 문의</a>
                    <a href="#">회사 소개</a>
                    <a href="#">FAQ</a>
                </div>
                <div className="footer-bottom">
                    <p>Copyright© 2024 Bestie Tutor All Rights Reserved</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
