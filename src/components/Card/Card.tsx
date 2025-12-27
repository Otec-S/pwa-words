import React, { useState, useEffect } from 'react';
import type { Card as CardType } from '../../types';
import { Timer } from '../Timer/Timer';
import { WordGroup } from '../WordGroup/WordGroup';
import './Card.css';

interface CardProps {
  card: CardType;
  animationClass?: string;
}

export const Card: React.FC<CardProps> = ({ card, animationClass = '' }) => {
  const [checkedState, setCheckedState] = useState<{ [key: string]: boolean }>({});
  const [isExpired, setIsExpired] = useState(false);

  // Reset state when card changes
  useEffect(() => {
    setCheckedState({});
    setIsExpired(false);
  }, [card.id]);

  const handleCheckChange = (wordKey: string) => {
    setCheckedState((prev) => ({
      ...prev,
      [wordKey]: !prev[wordKey],
    }));
  };

  const calculateTotalScore = (): number => {
    let total = 0;
    card.groups.forEach((group, groupIndex) => {
      group.words.forEach((_, wordIndex) => {
        const wordKey = `g${groupIndex}-w${wordIndex}`;
        if (checkedState[wordKey]) {
          total += group.points;
        }
      });
    });
    return total;
  };

  const handleTimerExpire = () => {
    setIsExpired(true);
  };

  return (
    <div className={`card ${isExpired ? 'card--expired' : ''} ${animationClass}`}>
      <Timer 
        cardId={card.id} 
        timerDuration={120}
        onExpire={handleTimerExpire}
        totalScore={calculateTotalScore()}
      />
      
      <div className="card__content">
        {card.groups.map((group, index) => (
          <WordGroup
            key={`group-${index}`}
            words={group.words}
            points={group.points}
            groupIndex={index}
            checkedState={checkedState}
            onCheckChange={handleCheckChange}
          />
        ))}
      </div>
    </div>
  );
};
