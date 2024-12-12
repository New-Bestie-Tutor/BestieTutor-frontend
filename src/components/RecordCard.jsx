// components/RecordCard.jsx
import React from "react";
import '../App.css';

export default function RecordCard({ record }) {

const category = record.topicDescription.split(" - ")[0];
const topic = record.topicDescription.split(" - ")[1];
const level = record.topicDescription.split(" - ")[2];
const startTime = new Date(record.startTime);
const endTime = new Date(record.endTime);
const time = endTime && startTime ? (endTime - startTime) / (1000 * 60) : 0; 

  return (
    <div className="record-card">
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
