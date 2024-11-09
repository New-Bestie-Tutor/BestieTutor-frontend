import React from 'react';
import '../App.css';

const CharacterItem = ({ icon, text, selected, onClick }) => {
    return (
        <div className={`character-item ${selected ? 'selected' : ''}`} onClick={onClick}>
            <img src={icon} alt={text} className="character-icon" />
            <p className="character-text">{text ? text.charAt(0).toUpperCase() + text.slice(1) : ''}</p>
        </div>
    );
};

export default CharacterItem;
