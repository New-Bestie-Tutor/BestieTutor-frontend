import Footer from "../components/Footer"
import Header from "../components/Header"
import { useContext, useEffect, useState } from 'react';
import { UserContext } from '../UserContext';
import axios from 'axios'; 
import '../App.css'

export default function Event() {

  const [events, setEvents] = useState([]);
  const [eventDetail, setEventDetail] = useState(null);

  const localDate = (date) => new Date(date).toLocaleString();

  const getAllEvents = async () => {
    try {
      const response = await axios.get('/event');
      if (response.status === 200) {
        const sortedEvents = response.data.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        const EventsWithIndex = sortedEvents.map((event, index) => ({
          ...event,
          index: sortedEvents.length - index,
      }))
      setEvents(EventsWithIndex);
      // console.log(EventsWithIndex);
    }
        
    } catch (error) {
      console.error("이벤트 불러오기 실패", error);
    }
  }

  const getEventDetail = async (id) => {
    try{
      const response = await axios.get(`/event/${id}`);
      if (response.status === 200) {
        setEventDetail(response.data.data);
        // console.log(response.data.data);
      }
    } catch (error) {
      // console.error("공지 불러오기 실패", error);
    }
  }
  
  useEffect(() => {
      getAllEvents();
    }, []);

  return (
    <div className="Home">
      <Header />
      <div className="notice-container">
        <h1>이벤트</h1>
        {eventDetail ? (
          <div className="notice-detail">
            <h2>{eventDetail.title}</h2>
            <p>{localDate(eventDetail.createdAt)}</p>
            <div className="notice-content">{eventDetail.content}</div>
            <button onClick={() => setEventDetail(null)}>
              Back
            </button>
          </div>
        ) : (
          <div className="notice-section">
          {events.map((item) => (
            <div 
              key={item._id}
              className="notice-item"
              onClick={() => getEventDetail(item._id)}
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
