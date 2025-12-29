import { useState } from 'react';
import { Card } from './components/Card/Card';
import { Navigation } from './components/Navigation/Navigation';
import { useSwipe } from './hooks/useSwipe';
import { useKeyboard } from './hooks/useKeyboard';
import type { Card as CardType } from './types';
import cardsDataImport from './data/cards.json';
import './App.css';

const cardsData = cardsDataImport as { cards: CardType[] };

function App() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [animationClass, setAnimationClass] = useState('');
  const [isExpired, setIsExpired] = useState(false);

  const cards = cardsData.cards;
  const currentCard = cards[currentIndex];

  const goToNext = () => {
    if (currentIndex < cards.length - 1) {
      setAnimationClass('slide-out-left');
      setTimeout(() => {
        setCurrentIndex(currentIndex + 1);
        setAnimationClass('slide-in-right');
      }, 300);
    }
  };

  const goToPrevious = () => {
    if (currentIndex > 0) {
      setAnimationClass('slide-out-right');
      setTimeout(() => {
        setCurrentIndex(currentIndex - 1);
        setAnimationClass('slide-in-left');
      }, 300);
    }
  };

  // Touch swipe support
  useSwipe({
    onSwipeLeft: goToNext,
    onSwipeRight: goToPrevious,
  });

  // Keyboard navigation support
  useKeyboard({
    onArrowLeft: goToPrevious,
    onArrowRight: goToNext,
  });

  return (
    <div className="app">
      <div className="app__container">
        <div className={`app__card-wrapper${isExpired ? ' app__card-wrapper--expired' : ''}`}>
          <Card card={currentCard} animationClass={animationClass} onExpireStateChange={setIsExpired} />
        </div>
        <Navigation
          onPrevious={goToPrevious}
          onNext={goToNext}
          hasPrevious={currentIndex > 0}
          hasNext={currentIndex < cards.length - 1}
        />
      </div>
    </div>
  );
}

export default App;

