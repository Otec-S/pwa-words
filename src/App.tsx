import { useState, useRef, useCallback, useEffect } from 'react';
import { Card } from './components/Card/Card';
import { Navigation } from './components/Navigation/Navigation';
import { useSwipe } from './hooks/useSwipe';
import { useKeyboard } from './hooks/useKeyboard';
import type { Card as CardType } from './types';
import { CARD_ANIMATION_MS } from './constants';
import cardsDataImport from './data/cards.json';
import './App.css';

const cardsData = cardsDataImport as { cards: CardType[] };

function App() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [animationClass, setAnimationClass] = useState('');
  const [isExpired, setIsExpired] = useState(false);

  const isAnimating = useRef(false);
  const animationTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const cards = cardsData.cards;
  const currentCard = cards[currentIndex];

  const clearAnimationTimeout = useCallback(() => {
    if (animationTimeoutRef.current != null) {
      clearTimeout(animationTimeoutRef.current);
      animationTimeoutRef.current = null;
    }
  }, []);

  const navigate = useCallback(
    (direction: 'next' | 'previous') => {
      if (isAnimating.current) return;

      const canGoNext = direction === 'next' && currentIndex < cards.length - 1;
      const canGoPrevious = direction === 'previous' && currentIndex > 0;
      if (!canGoNext && !canGoPrevious) return;

      isAnimating.current = true;
      clearAnimationTimeout();

      const slideOut = direction === 'next' ? 'slide-out-left' : 'slide-out-right';
      const slideIn = direction === 'next' ? 'slide-in-right' : 'slide-in-left';

      setAnimationClass(slideOut);

      animationTimeoutRef.current = setTimeout(() => {
        setCurrentIndex((index) => (direction === 'next' ? index + 1 : index - 1));
        setAnimationClass(slideIn);

        animationTimeoutRef.current = setTimeout(() => {
          setAnimationClass('');
          isAnimating.current = false;
          animationTimeoutRef.current = null;
        }, CARD_ANIMATION_MS);
      }, CARD_ANIMATION_MS);
    },
    [currentIndex, cards.length, clearAnimationTimeout],
  );

  const goToNext = useCallback(() => navigate('next'), [navigate]);
  const goToPrevious = useCallback(() => navigate('previous'), [navigate]);

  useEffect(() => {
    return () => clearAnimationTimeout();
  }, [clearAnimationTimeout]);

  useSwipe({
    onSwipeLeft: goToNext,
    onSwipeRight: goToPrevious,
  });

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
