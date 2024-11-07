import React from 'react';
import Description from './Description';
import '../App.css';

function SubTopicBox({ topic, isSelected, onSelect, selectedLevel, onLevelSelect, description }) {
    return (
        <div
          onClick={onSelect}
          className={`sub-topic-box ${isSelected ? 'selected' : ''}`}
        >
          {/* 주제 이름 */}
          <h3>{topic}</h3>

          {/* 레벨 선택 버튼들 */}
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

                  {/* 설명 표시 */}
                  {description && <Description text={description} />}
              </div>
          )}
        </div>
    );
}

export default SubTopicBox;
