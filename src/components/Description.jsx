import React from 'react';
import '../App.css'; 

function Description({ text }) {
  if (!text) return null; // text가 없으면 렌더링하지 않음

  return (
    <div className="description-box">
      <p>{text}</p>
    </div>
  );
}

export default Description;
