import React, { useEffect, useState } from 'react';
import styles from './RestTimer.module.css';

interface RestTimerProps {
  initialSeconds?: number;
  isOpen: boolean;
  onClose: () => void;
  onSelectDuration?: (secs: number) => void;
}

export const RestTimer: React.FC<RestTimerProps> = ({
  initialSeconds = 90,
  isOpen,
  onClose,
  onSelectDuration
}) => {
  const [secondsLeft, setSecondsLeft] = useState<number>(initialSeconds);
  const [isRunning, setIsRunning] = useState<boolean>(true);
  const [totalSeconds, setTotalSeconds] = useState<number>(initialSeconds);
  const [showPresets, setShowPresets] = useState<boolean>(false);

  useEffect(() => {
    if (isOpen) {
      setSecondsLeft(initialSeconds);
      setTotalSeconds(initialSeconds);
      setIsRunning(true);
      setShowPresets(false);
    }
  }, [isOpen, initialSeconds]);

  useEffect(() => {
    let interval: number | null = null;
    if (isOpen && isRunning && secondsLeft > 0) {
      interval = window.setInterval(() => {
        setSecondsLeft((prev) => {
          if (prev <= 1) {
            setIsRunning(false);
            if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
              try {
                navigator.vibrate([200, 100, 200, 100, 300]);
              } catch {
                // ignore
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

  const handleSetPreset = (presetSeconds: number) => {
    setTotalSeconds(presetSeconds);
    setSecondsLeft(presetSeconds);
    setIsRunning(true);
    setShowPresets(false);
    if (onSelectDuration) {
      onSelectDuration(presetSeconds);
    }
  };

  const presetOptions = [
    { label: '30s', value: 30 },
    { label: '60s (1p)', value: 60 },
    { label: '90s (1.5p)', value: 90 },
    { label: '120s (2p)', value: 120 },
    { label: '150s (2.5p)', value: 150 },
    { label: '180s (3p)', value: 180 },
  ];

  return (
    <>
      {showPresets && (
        <div className={styles.presetBackdrop} onClick={() => setShowPresets(false)}>
          <div className={styles.presetCard} onClick={(e) => e.stopPropagation()}>
            <div className={styles.presetTitle}>Chọn thời gian nghỉ chuẩn</div>
            <div className={styles.presetGrid}>
              {presetOptions.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  className={`${styles.presetBtn} ${totalSeconds === opt.value ? styles.presetBtnActive : ''}`}
                  onClick={() => handleSetPreset(opt.value)}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className={styles.floatingTimerBar}>
        {/* Progress bar line at top */}
        <div className={styles.progressTrack}>
          <div
            className={styles.progressBar}
            style={{ width: `${Math.min(100, progressPercent)}%` }}
          />
        </div>

        <div className={styles.barContent}>
          {/* Left: Stopwatch & Time */}
          <div className={styles.timeGroup} onClick={() => setIsRunning(!isRunning)} title="Chạm để tạm dừng/tiếp tục">
            <span className={styles.timerIcon}>{secondsLeft === 0 ? '🔔' : isRunning ? '⏱️' : '⏸️'}</span>
            <span className={`${styles.timeDisplay} ${secondsLeft === 0 ? styles.timeFinished : ''}`}>
              {formattedTime}
            </span>
          </div>

          {/* Center: Suggestion text with dropdown arrow */}
          <button
            type="button"
            className={styles.presetTrigger}
            onClick={() => setShowPresets(!showPresets)}
          >
            <span className={styles.presetLabel}>
              {secondsLeft === 0
                ? 'Đã hết giờ nghỉ!'
                : `Nghỉ ${Math.floor(totalSeconds / 60)}:${String(totalSeconds % 60).padStart(2, '0')}`}
            </span>
            <span className={styles.dropdownArrow}>▾</span>
          </button>

          {/* Right: Quick adjustment & Close */}
          <div className={styles.actionGroup}>
            <button
              type="button"
              className={styles.adjustBtn}
              onClick={() => handleAdjust(-15)}
              disabled={secondsLeft <= 0}
              aria-label="Giảm 15 giây"
            >
              -15
            </button>
            <button
              type="button"
              className={styles.adjustBtn}
              onClick={() => handleAdjust(15)}
              aria-label="Tăng 15 giây"
            >
              +15
            </button>
            <button
              type="button"
              className={styles.closeBtn}
              onClick={onClose}
              aria-label="Đóng đếm giờ"
            >
              ✕
            </button>
          </div>
        </div>
      </div>
    </>
  );
};
