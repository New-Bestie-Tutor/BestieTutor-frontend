import Header from "../components/Header";
import Footer from "../components/Footer";
import { useContext, useEffect, useState } from "react";
import { UserContext } from "../UserContext";
import axios from "axios";
import "../App.css";

export default function Inquiry() {
  const { userInfo } = useContext(UserContext);
  const [inquiries, setInquiries] = useState([]);
  const [inquiryDetail, setInquiryDetail] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const [category, setCategory] = useState("");
  const [question, setQuestion] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const localDate = (date) => new Date(date).toLocaleString();

  const getAllInquiries = async () => {
    try {
      const response = await axios.get("/inquiries");
      if (response.data.success) {
        const sorted = response.data.data.sort((a, b) => new Date(b.askedAt || b.createdAt) - new Date(a.askedAt || a.createdAt));
        const withIndex = sorted.map((inquiry, idx) => ({
          ...inquiry,
          index: sorted.length - idx,
        }));
        setInquiries(withIndex);
      }
    } catch (err) {
      console.error("문의 목록 불러오기 실패", err);
    }
  };

  const getInquiryDetail = async (id) => {
    try {
      const response = await axios.get(`/inquiries/${id}`);
      if (response.data.success) {
        setInquiryDetail(response.data.data);
      }
    } catch (err) {
      console.error("문의 상세 불러오기 실패", err);
    }
  };

  const submitInquiry = async (e) => {
    e.preventDefault();
    if (!category || !question) {
      setErrorMsg("카테고리와 질문을 모두 입력해 주세요.");
      return;
    }

    try {
      const response = await axios.post("/inquiries", { category, question });
      if (response.data.success) {
        setCategory("");
        setQuestion("");
        setShowForm(false);
        setErrorMsg("");
        await getAllInquiries();
      } else {
        setErrorMsg(response.data.msg || "문의 등록에 실패했습니다.");
      }
    } catch (err) {
      setErrorMsg("서버 오류가 발생했습니다.");
    }
  };

  useEffect(() => {
    getAllInquiries();
  }, []);

  return (
    <div className="Home">
      <Header />
      <div className="notice-container">
        <h1>문의사항</h1>

        {inquiryDetail ? (
          <div className="notice-detail">
            <h2>{inquiryDetail.category}</h2>
            <p>{localDate(inquiryDetail.askedAt || inquiryDetail.createdAt)}</p>
            <div className="notice-content">{inquiryDetail.question}</div>
            <button onClick={() => setInquiryDetail(null)}>Back</button>
          </div>
        ) : (
          <>
            {userInfo && (
              <button onClick={() => setShowForm(!showForm)}>
                {showForm ? "작성 취소" : "문의 작성하기"}
              </button>
            )}
            {showForm && (
              <form onSubmit={submitInquiry} className="inquiry-form">
                <label>
                  카테고리:
                  <input
                    type="text"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                  />
                </label>
                <label>
                  질문 내용:
                  <textarea
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                  ></textarea>
                </label>
                {errorMsg && <p className="error">{errorMsg}</p>}
                <button type="submit">등록</button>
              </form>
            )}

            <div className="notice-section">
              {inquiries.map((item) => (
                <div
                  key={item._id}
                  className="notice-item"
                  onClick={() => getInquiryDetail(item._id)}
                >
                  <div className="notice-title">
                    <h2>{item.index}</h2>
                    <h3>{item.category}</h3>
                  </div>
                  <p>{localDate(item.askedAt || item.createdAt)}</p>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
      <Footer />
    </div>
  );
}
