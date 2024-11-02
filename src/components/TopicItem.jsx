// TopicItem.js
import React from 'react';
import '../App.css';

const TopicItem = ({ icon, text, selected, onClick }) => {
    return (
        <div className={`topic-item ${selected ? 'selected' : ''}`} onClick={onClick}>
            <img src={icon} alt={text} className="topic-icon" />
            <p className="topic-text">{text}</p>
        </div>
    );
};

export default TopicItem;
