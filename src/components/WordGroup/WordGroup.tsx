import React from 'react';
import './WordGroup.css';

interface WordGroupProps {
  words: string[];
  points: 3 | 5 | 7;
  groupIndex: number;
  checkedState: { [key: string]: boolean };
  onCheckChange: (wordKey: string) => void;
}

export const WordGroup: React.FC<WordGroupProps> = ({
  words,
  points,
  groupIndex,
  checkedState,
  onCheckChange,
}) => {
  return (
    <div className="word-group">
      <div className="word-group__header">
        <span className="word-group__points">{points} очк.</span>
      </div>
      <div className="word-group__words">
        {words.map((word, wordIndex) => {
          const wordKey = `g${groupIndex}-w${wordIndex}`;
          return (
            <div key={wordKey} className="word-item">
              <input
                type="checkbox"
                id={wordKey}
                className="word-item__checkbox"
                checked={checkedState[wordKey] || false}
                onChange={() => onCheckChange(wordKey)}
              />
              <label htmlFor={wordKey} className="word-item__label">
                {word}
              </label>
            </div>
          );
        })}
      </div>
    </div>
  );
};
