import { useState, useEffect, useContext } from "react";
import { Link } from 'react-router-dom';
import { useNavigate } from "react-router-dom";
import { UserContext } from "../UserContext";
import Header from "../components/Header";
import Footer from "../components/Footer";
import axios from "axios";
import "../App.css";

export default function Payment() {
  const { userInfo } = useContext(UserContext);
  const [user, setUser] = useState({});
  const [amount] = useState(9900); // 프리미엄 서비스 테스트 결제 금액
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const fetchUser = async () => {
    try {
      const response = await axios.get("/user/getUser", {
        params: { userId: userInfo.userId },
      });
      if (response.status === 200) {
        setUser(response.data);
      } else {
        console.error("사용자 정보를 불러오는데 실패했습니다.", response.status);
      }
    } catch (error) {
      console.error("API 호출 오류:", error);
    }
  };

  useEffect(() => {
    if (userInfo?.userId) {
      fetchUser();
    }
  }, [userInfo]);

  // 포트원 스크립트 동적 로드
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://cdn.iamport.kr/v1/iamport.js";
    script.async = true;
    document.body.appendChild(script);

    script.onload = () => {
      if (window.IMP) {
        console.log("포트원 스크립트가 로드되었습니다.");
      } else {
        console.error("포트원 스크립트 로드 실패");
      }
    };

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const handlePayment = async () => {
    if (!window.IMP) {
      alert("결제 모듈이 로드되지 않았습니다. 잠시 후 다시 시도해주세요.");
      return;
    }

    const userId = userInfo?.userId || user?.userId;

    if (!userId || !userInfo.email) {
      alert("사용자 정보가 없습니다. 로그인 후 다시 시도해주세요.");
      return;
    }

    const IMP = window.IMP; // 포트원 전역 객체
    IMP.init("imp04448206"); // 포트원 테스트 모드 가맹점 식별 코드

    setLoading(true);

    try {
      // 요청 데이터 로그 출력
      const requestData = {
        userId,
        email: userInfo.email,
        amount,
        paymentMethod: "card", // 결제 방식 (카드 결제)
      };

      // 백엔드에서 결제 요청 생성
      const { data } = await axios.post("/payment/request", requestData);

      if (!data.success) {
        alert("결제 요청 생성에 실패했습니다.");
        setLoading(false);
        return;
      }

      const { merchantUid } = data.data; // 백엔드에서 받은 merchantUid

      // 포트원 결제 요청
      IMP.request_pay(
        {
          pg: "html5_inicis", // PG사 설정 (이니시스)
          pay_method: "card", // 결제 방식
          merchant_uid: merchantUid, // 백엔드에서 생성한 주문 ID 사용
          name: "프리미엄 업그레이드",
          amount: amount,
          buyer_email: userInfo.email,
          buyer_tel: userInfo.phone,
          buyer_addr: userInfo.address,
        },
        async (response) => {
          if (!response.imp_uid || !response.merchant_uid) {
            console.error("결제 응답 데이터가 누락되었습니다:", response);
            alert("결제 데이터가 올바르지 않습니다.");
            setLoading(false);
            return;
          }
          if (response.success) {
            try {
              const verifyResponse = await axios.post("/payment/verify", {
                imp_uid: response.imp_uid,
                merchant_uid: response.merchant_uid,
              });
              if (verifyResponse.data.success) {
                alert("결제가 성공적으로 완료되었습니다!");
                navigate("/mypage");
              } else {
                alert("결제 검증에 실패했습니다.");
              }
            } catch (error) {
              console.error("결제 검증 오류:", error);
              alert("결제 검증 중 오류가 발생했습니다.");
            }
          } else {
            alert(`결제에 실패했습니다: ${response.error_msg}`);
          }
          setLoading(false);
        }
      );
    } catch (error) {
      console.error("결제 요청 오류:", error);
      alert("결제 요청 중 오류가 발생했습니다.");
      setLoading(false);
    }
  };

  return (
    <div className="Home">
      <Header />
      <div className="upgrade-container">
        <div className="upgrade-top-bar">
          <Link to="/mypage" className="upgrade-back-arrow">←</Link>
          <h2>프리미엄 업그레이드</h2>
        </div>
        <p className="subtitle">매월 구독된 친구와 함께 무제한으로 읽으며 공부를 즐길 수 있어요.</p>

        <div className="plan-table">
          <div className="table-header">
            <div className="header-cell feature"></div>
            <div className="header-cell free">무료</div>
            <div className="header-cell premium">프리미엄</div>
          </div>

          <div className="table-row">
            <div className="cell feature">AI 채팅 학습 콘텐츠</div>
            <div className="cell">✔️</div>
            <div className="cell">✔️</div>
          </div>
          <div className="table-row">
            <div className="cell feature">고급 화자 모델로 업그레이드</div>
            <div className="cell">❌</div>
            <div className="cell">✔️</div>
          </div>
          <div className="table-row">
            <div className="cell feature">친구랑 함께 공부하는 그룹 채팅</div>
            <div className="cell">❌</div>
            <div className="cell">✔️</div>
          </div>
          <div className="table-row">
            <div className="cell feature">무제한 학습 시간과 횟수</div>
            <div className="cell">❌</div>
            <div className="cell">✔️</div>
          </div>
        </div>

        <button className="pay-button" onClick={handlePayment} disabled={loading}>
          {loading ? "결제 진행 중..." : "결제하기"}
        </button>
      </div>
      <Footer />
    </div>
  );
}