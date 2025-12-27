import { useState, useEffect, useCallback } from 'react';
import './Timer.css';

interface TimerProps {
  cardId: number;
  timerDuration?: number; // in seconds
  onExpire: () => void;
}

export const Timer: React.FC<TimerProps> = ({ 
  cardId, 
  timerDuration = 120, 
  onExpire 
}) => {
  const [timeLeft, setTimeLeft] = useState(timerDuration);
  const [isRunning, setIsRunning] = useState(false);

  // Reset timer when card changes
  useEffect(() => {
    setTimeLeft(timerDuration);
    setIsRunning(false);
  }, [cardId, timerDuration]);

  // Play sound using Web Audio API
  const playSound = useCallback(() => {
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.frequency.value = 900; // 900 Hz
    oscillator.type = 'sine';

    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.7);

    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.7); // 700ms duration
  }, []);

  // Timer countdown logic
  useEffect(() => {
    if (!isRunning) return;

    if (timeLeft <= 0) {
      playSound();
      onExpire();
      setIsRunning(false);
      return;
    }

    const intervalId = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(intervalId);
  }, [isRunning, timeLeft, playSound, onExpire]);

  const handleStartStop = () => {
    setIsRunning(!isRunning);
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="timer">
      <div className="timer-display">{formatTime(timeLeft)}</div>
      <button 
        className={`timer-button ${isRunning ? 'timer-button--stop' : 'timer-button--start'}`}
        onClick={handleStartStop}
      >
        {isRunning ? 'СТОП' : 'СТАРТ'}
      </button>
    </div>
  );
};
