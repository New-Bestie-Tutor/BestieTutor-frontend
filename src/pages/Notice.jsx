import Footer from "../components/Footer"
import Header from "../components/Header"
import { useContext, useEffect, useState } from 'react';
import { UserContext } from '../UserContext';
import axios from 'axios'; 
import '../App.css'

export default function Notice() {
  
  const [notices, setNotices] = useState([]);
  const [noticeDetail, setNoticeDetail] = useState(null);

  const localDate = (date) => new Date(date).toLocaleString();

  const getAllNotices = async () => {
    try {
      const response = await axios.get('/notices');
      if (response.status === 200) {
        const sortedNotices = response.data.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        const noticesWithIndex = sortedNotices.map((notice, index) => ({
          ...notice,
          index: sortedNotices.length - index,
      }))
      setNotices(noticesWithIndex);
      // console.log(noticesWithIndex);
    }
        
    } catch (error) {
      // console.error("공지 불러오기 실패", error);
    }
  }

  const getNoticeDetail = async (id) => {
    try{
      const response = await axios.get(`/notices/${id}`);
      if (response.status === 200) {
        setNoticeDetail(response.data.data);
        // console.log(response.data.data);
      }
    } catch (error) {
      // console.error("공지 불러오기 실패", error);
    }
  }
  
  useEffect(() => {
      getAllNotices();
    }, []);

  return (
    <div className="Home">
      <Header />
      <div className="notice-container">
        <h1>공지사항</h1>
        {noticeDetail ? (
          <div className="notice-detail">
            <h2>{noticeDetail.title}</h2>
            <p>{localDate(noticeDetail.createdAt)}</p>
            <div className="notice-content">{noticeDetail.content}</div>
            <button onClick={() => setNoticeDetail(null)}>
              Back
            </button>
          </div>
        ) : (
          <div className="notice-section">
          {notices.map((item) => (
            <div 
              key={item._id}
              className="notice-item"
              onClick={() => getNoticeDetail(item._id)}
            >
              <div className="notice-title">
                <h2>{item.index}</h2>
                <h3>{item.title}</h3>
              </div>
              <p>{localDate(item.createdAt)}</p>
           </div>
        ))}
        </div>
        )}
      </div>
      <Footer />
    </div>
  );
}
