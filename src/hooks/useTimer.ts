import { useState, useEffect, useRef, useCallback } from 'react';

// Hook đếm thời gian tập luyện (tăng dần từ 0)
export function useStopwatch(autoStart: boolean = false) {
  const [seconds, setSeconds] = useState<number>(0);
  const [isRunning, setIsRunning] = useState<boolean>(autoStart);
  const intervalRef = useRef<number | null>(null);

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = window.setInterval(() => {
        setSeconds((prev) => prev + 1);
      }, 1000);
    } else if (intervalRef.current !== null) {
      clearInterval(intervalRef.current);
    }

    return () => {
      if (intervalRef.current !== null) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning]);

  const start = useCallback(() => setIsRunning(true), []);
  const pause = useCallback(() => setIsRunning(false), []);
  const reset = useCallback(() => {
    setIsRunning(false);
    setSeconds(0);
  }, []);

  return { seconds, isRunning, start, pause, reset, setSeconds };
}

// Hook đếm ngược thời gian nghỉ giữa các hiệp (Rest Timer)
export function useCountdown(initialSeconds: number = 60, onComplete?: () => void) {
  const [timeLeft, setTimeLeft] = useState<number>(initialSeconds);
  const [isActive, setIsActive] = useState<boolean>(false);
  const timerRef = useRef<number | null>(null);
  const onCompleteRef = useRef(onComplete);

  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  useEffect(() => {
    if (isActive && timeLeft > 0) {
      timerRef.current = window.setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            setIsActive(false);
            if (onCompleteRef.current) {
              onCompleteRef.current();
            }
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else if (!isActive && timerRef.current !== null) {
      clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current !== null) {
        clearInterval(timerRef.current);
      }
    };
  }, [isActive, timeLeft]);

  const startTimer = useCallback((customSeconds?: number) => {
    if (customSeconds !== undefined) {
      setTimeLeft(customSeconds);
    }
    setIsActive(true);
  }, []);

  const pauseTimer = useCallback(() => {
    setIsActive(false);
  }, []);

  const resetTimer = useCallback((newSeconds?: number) => {
    setIsActive(false);
    setTimeLeft(newSeconds !== undefined ? newSeconds : initialSeconds);
  }, [initialSeconds]);

  const addSeconds = useCallback((sec: number) => {
    setTimeLeft((prev) => Math.max(0, prev + sec));
  }, []);

  return { timeLeft, isActive, startTimer, pauseTimer, resetTimer, addSeconds };
}
