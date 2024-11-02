import React from 'react';
import Description from './Description';
import '../App.css';

function SubTopicBox({ topic, isSelected, onSelect, selectedLevel, onLevelSelect, description }) {
    return (
        <div
          onClick={onSelect}
          className={`sub-topic-box ${isSelected ? 'selected' : ''}`}
        >
          <h3>{topic.name}</h3>
          {/* Level Buttons */}
          {isSelected && (
              <div className="level-section">
                  <div className="level-buttons">
                      {['easy', 'normal', 'hard'].map((level) => (
                          <button
                              key={level}
                              onClick={(e) => {
                                  e.stopPropagation(); // Prevent the click from bubbling up to the sub-topic box
                                  onLevelSelect(level);
                              }}
                              className={`level-button ${selectedLevel === level ? 'selected' : ''}`}
                          >
                              {level}
                          </button>
                      ))}
                  </div>

                  {/* Description */}
                  {description && <Description text={description} />}
              </div>
          )}
        </div>
    );
}

export default SubTopicBox;
