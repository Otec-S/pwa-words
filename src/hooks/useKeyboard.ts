import { useEffect } from 'react';

interface KeyboardHandlers {
  onArrowLeft?: () => void;
  onArrowRight?: () => void;
}

export const useKeyboard = (handlers: KeyboardHandlers) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft' && handlers.onArrowLeft) {
        handlers.onArrowLeft();
      }
      if (e.key === 'ArrowRight' && handlers.onArrowRight) {
        handlers.onArrowRight();
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [handlers]);
};
