// components/RecordCard.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import '../App.css';

export default function RecordCard({ record }) {

let category = "", topic = "", level = "";
if (record.topic_description) {
  const parts = record.topic_description.split("-");
  if (parts.length === 3) {
    [category, topic, level] = parts;
  } else {
    // fallback for 자유 주제 등
    category = record.topic_description;
    topic = "자유주제 대화";
    level = "normal"; // 또는 기본값
  }
}
/* const category = record.topicDescription.split(" - ")[0];
const topic = record.topicDescription.split(" - ")[1];
const level = record.topicDescription.split(" - ")[2]; */
const startTime = new Date(record.start_time);
const endTime = record.end_time ? new Date(record.end_time) : 0;
const time = endTime && startTime ? (endTime - startTime) / (1000 * 60) : 0; 

const navigate = useNavigate();
const reviewHandler = (conversationId, description) => {
  navigate('/feedback', { state: { conversationId, description } }); 
};

  return (
    <div className="record-card" onClick={() => reviewHandler(record.conversationId, record.description)}>
      <div className="record-header">
        <div className="record-header-top">
          <p className="record-category">{category}</p>
          <p className="record-date">{startTime.toLocaleDateString()}</p>
        </div>
        <div className="record-header-second">
          <p className="record-topic">{topic}</p>
          <p className="record-time">{time.toFixed(1)}분</p>
        </div>
      </div>
      <div className="record-content">
        <span className={`level-badge ${level}`}>
        {level === "easy" ? "초급" : level === "normal" ? "중급" : "고급"}
        </span>
        <p className="record-title">{record.description}</p>
      </div>
    </div>
  );
};
