import IMAGES from "../images/images";

export default function Footer() {
    return (
        <div class="footer">
            <div class="footer-head">
                <h2>(주)Bestie Tutor</h2>
                <ul class="sns">
                    <img src={IMAGES.instagram} alt="instagram" className="image" />
                    <img src={IMAGES.youtube} alt="youtube" className="image" />
                    <img src={IMAGES.kakaotalk} alt="kakaotalk" className="image" />
                </ul>
            </div>
            <button type="button">사업자 정보 펼쳐보기</button>
            <ul class="services">
                <li>
                    <a href="">이용약관</a>
                </li>
                <li>
                    <a href="">
                        <strong>개인정보처리방침</strong>
                    </a>
                </li>
                <li>
                    <a href="">고객센터</a>
                </li>
                <li>
                    <a href="">환불신청</a>
                </li>
                <li>
                    <a href="">B2B문의</a>
                </li>
                <li>
                    <a href="">회사소개</a>
                </li>
                <li>
                    <a href="">FAQ</a>
                </li>
            </ul>
            <p class="copyright">Copyright © 2024 Bestie Tutor All Rights Reserved.</p>

        </div>
    )
}