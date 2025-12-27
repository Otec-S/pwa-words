import React from 'react';
import './Navigation.css';

interface NavigationProps {
  onPrevious: () => void;
  onNext: () => void;
  hasPrevious: boolean;
  hasNext: boolean;
}

export const Navigation: React.FC<NavigationProps> = ({
  onPrevious,
  onNext,
  hasPrevious,
  hasNext,
}) => {
  return (
    <div className="navigation">
      <button
        className="navigation__button navigation__button--prev"
        onClick={onPrevious}
        disabled={!hasPrevious}
        aria-label="Previous card"
      >
        ←
      </button>
      <button
        className="navigation__button navigation__button--next"
        onClick={onNext}
        disabled={!hasNext}
        aria-label="Next card"
      >
        →
      </button>
    </div>
  );
};
