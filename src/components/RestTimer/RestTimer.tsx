import React, { useEffect, useState } from 'react';
import styles from './RestTimer.module.css';

interface RestTimerProps {
  initialSeconds?: number;
  isOpen: boolean;
  onClose: () => void;
}

export const RestTimer: React.FC<RestTimerProps> = ({
  initialSeconds = 60,
  isOpen,
  onClose
}) => {
  const [secondsLeft, setSecondsLeft] = useState<number>(initialSeconds);
  const [isRunning, setIsRunning] = useState<boolean>(true);
  const [totalSeconds, setTotalSeconds] = useState<number>(initialSeconds);

  useEffect(() => {
    if (isOpen) {
      setSecondsLeft(initialSeconds);
      setTotalSeconds(initialSeconds);
      setIsRunning(true);
    }
  }, [isOpen, initialSeconds]);

  useEffect(() => {
    let interval: number | null = null;
    if (isOpen && isRunning && secondsLeft > 0) {
      interval = window.setInterval(() => {
        setSecondsLeft((prev) => {
          if (prev <= 1) {
            setIsRunning(false);
            // Kích hoạt rung trên mobile nếu trình duyệt hỗ trợ
            if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
              try {
                navigator.vibrate([200, 100, 200]);
              } catch {
                // Bỏ qua nếu bị chặn quyền
              }
            }
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (interval !== null) clearInterval(interval);
    };
  }, [isOpen, isRunning, secondsLeft]);

  if (!isOpen) return null;

  const minutes = Math.floor(secondsLeft / 60);
  const remainingSecs = secondsLeft % 60;
  const formattedTime = `${String(minutes).padStart(2, '0')}:${String(remainingSecs).padStart(2, '0')}`;
  const progressPercent = totalSeconds > 0 ? ((totalSeconds - secondsLeft) / totalSeconds) * 100 : 0;

  const handleAdjust = (delta: number) => {
    setSecondsLeft((prev) => {
      const next = Math.max(0, prev + delta);
      setTotalSeconds((tot) => Math.max(tot, next));
      return next;
    });
  };

  return (
    <div className={styles.restTimerOverlay}>
      <div className={styles.header}>
        <div className={styles.title}>
          <span>⏱️</span>
          <span>Thời gian nghỉ giữa hiệp</span>
        </div>
        <button
          type="button"
          className={styles.closeButton}
          onClick={onClose}
          aria-label="Đóng bộ hẹn giờ"
        >
          ✕
        </button>
      </div>

      <div className={styles.timerBody}>
        <div className={styles.displayWrapper}>
          <span className={styles.timeDisplay}>{formattedTime}</span>
          <span className={styles.timeUnit}>giây</span>
        </div>

        <div className={styles.controls}>
          <div className={styles.adjustGroup}>
            <button
              type="button"
              className={styles.adjustBtn}
              onClick={() => handleAdjust(-15)}
              disabled={secondsLeft <= 0}
            >
              -15s
            </button>
            <button
              type="button"
              className={styles.adjustBtn}
              onClick={() => handleAdjust(15)}
            >
              +15s
            </button>
          </div>

          <button
            type="button"
            className={`${styles.btn} ${styles.btnPrimary}`}
            onClick={() => setIsRunning(!isRunning)}
          >
            {secondsLeft === 0 ? 'Hết giờ' : isRunning ? 'Tạm dừng' : 'Tiếp tục'}
          </button>
        </div>
      </div>

      <div className={styles.progressBarContainer}>
        <div
          className={styles.progressBar}
          style={{ width: `${Math.min(100, progressPercent)}%` }}
        />
      </div>
    </div>
  );
};
