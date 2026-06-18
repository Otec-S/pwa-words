import { useState, useEffect, useCallback, useRef } from 'react';
import { TIMER_DURATION } from '../../constants';
import './Timer.css';

const NOTE = {
  G4: 392.0,
  C5: 523.25,
  D5: 587.33,
  E5: 659.25,
  G5: 783.99,
  A5: 880.0,
  B5: 987.77,
  C6: 1046.5,
  D6: 1174.66,
  E6: 1318.51,
  G6: 1567.98,
} as const;

const MELODY: { freq: number; duration: number }[] = [
  { freq: NOTE.C5, duration: 0.10 },
  { freq: NOTE.E5, duration: 0.10 },
  { freq: NOTE.G5, duration: 0.10 },
  { freq: NOTE.C6, duration: 0.10 },
  { freq: NOTE.E6, duration: 0.10 },
  { freq: NOTE.G6, duration: 0.10 },
  { freq: NOTE.E6, duration: 0.10 },
  { freq: NOTE.C6, duration: 0.10 },
  { freq: NOTE.G5, duration: 0.10 },
  { freq: NOTE.E5, duration: 0.10 },
  { freq: NOTE.C5, duration: 0.10 },
  { freq: NOTE.G4, duration: 0.10 },
  { freq: NOTE.G4, duration: 0.15 },
  { freq: NOTE.G4, duration: 0.15 },
  { freq: NOTE.G4, duration: 0.15 },
  { freq: NOTE.C5, duration: 0.45 },
  { freq: NOTE.E5, duration: 0.15 },
  { freq: NOTE.G5, duration: 0.15 },
  { freq: NOTE.C6, duration: 0.45 },
  { freq: NOTE.G5, duration: 0.15 },
  { freq: NOTE.E5, duration: 0.15 },
  { freq: NOTE.C5, duration: 0.15 },
  { freq: NOTE.E5, duration: 0.15 },
  { freq: NOTE.G5, duration: 0.55 },
  { freq: NOTE.C6, duration: 0.85 },
];

const playNote = (
  audioContext: AudioContext,
  frequency: number,
  startTime: number,
  duration: number,
) => {
  const oscillator = audioContext.createOscillator();
  const gainNode = audioContext.createGain();

  oscillator.type = 'square';
  oscillator.frequency.value = frequency;
  oscillator.connect(gainNode);
  gainNode.connect(audioContext.destination);

  gainNode.gain.setValueAtTime(1, startTime);
  gainNode.gain.setValueAtTime(1, startTime + duration);
  gainNode.gain.setValueAtTime(0, startTime + duration + 0.01);

  oscillator.start(startTime);
  oscillator.stop(startTime + duration + 0.01);
};

interface TimerProps {
  timerDuration?: number; // in seconds
  onExpire: () => void;
  totalScore: number;
}

export const Timer: React.FC<TimerProps> = ({ 
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
    const startTime = audioContext.currentTime;
    let offset = 0;

    for (const { freq, duration } of MELODY) {
      playNote(audioContext, freq, startTime + offset, duration);
      offset += duration;
    }
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
    if (isRunning) {
      setIsRunning(false);
      return;
    }
    void ensureAudioContext();
    setIsRunning(true);
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
