import { useState, useEffect, useCallback, useRef } from 'react';
import { TIMER_DURATION } from '../../constants';
import './Timer.css';

const SOUND_FREQUENCY = 900;
const SOUND_DURATION = 0.7;

interface TimerProps {
  cardId: number;
  timerDuration?: number; // in seconds
  onExpire: () => void;
  totalScore: number;
}

export const Timer: React.FC<TimerProps> = ({ 
  cardId, 
  timerDuration = TIMER_DURATION, 
  onExpire,
  totalScore 
}) => {
  const [timeLeft, setTimeLeft] = useState(timerDuration);
  const [isRunning, setIsRunning] = useState(false);
  const audioContextRef = useRef<AudioContext | null>(null);
  const hasExpiredRef = useRef(false);
  const onExpireRef = useRef(onExpire);
  onExpireRef.current = onExpire;

  // Reset timer when card changes
  useEffect(() => {
    setTimeLeft(timerDuration);
    setIsRunning(false);
    hasExpiredRef.current = false;
  }, [cardId, timerDuration]);

  const ensureAudioContext = useCallback(async () => {
    if (!audioContextRef.current) {
      const AudioContextClass = window.AudioContext || (window as typeof window & { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      audioContextRef.current = new AudioContextClass();
    }
    if (audioContextRef.current.state === 'suspended') {
      await audioContextRef.current.resume();
    }
    return audioContextRef.current;
  }, []);

  const playSound = useCallback(async () => {
    const audioContext = await ensureAudioContext();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.frequency.value = SOUND_FREQUENCY;
    oscillator.type = 'sine';

    const startTime = audioContext.currentTime;
    gainNode.gain.setValueAtTime(0.3, startTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + SOUND_DURATION);

    oscillator.start(startTime);
    oscillator.stop(startTime + SOUND_DURATION);
  }, [ensureAudioContext]);

  const handleExpire = useCallback(() => {
    if (hasExpiredRef.current) return;
    hasExpiredRef.current = true;
    void playSound();
    onExpireRef.current();
    setIsRunning(false);
  }, [playSound]);

  // Timer countdown logic
  useEffect(() => {
    if (!isRunning) return;

    if (timeLeft <= 0) {
      handleExpire();
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
  }, [isRunning, timeLeft, handleExpire]);

  const handleStartStop = () => {
    if (!isRunning) {
      void ensureAudioContext();
    }
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
      <div className="timer-score">
        <span className="timer-score__label">Итого:</span>
        <span className="timer-score__value">{totalScore} очк.</span>
      </div>
    </div>
  );
};
