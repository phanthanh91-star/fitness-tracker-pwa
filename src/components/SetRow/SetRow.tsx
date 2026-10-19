import React from 'react';
import styles from './SetRow.module.css';
import { WorkoutSet } from '../../types';

interface SetRowProps {
  index: number;
  set: WorkoutSet;
  previousPerformance?: string;
  isBodyweight?: boolean;
  isDurationBased?: boolean;
  onUpdate: (updatedSet: WorkoutSet) => void;
  onDelete: (setId: string) => void;
  onCompleteSet: (setId: string) => void;
}

export const SetRow: React.FC<SetRowProps> = ({
  index,
  set,
  previousPerformance = '-',
  isBodyweight = false,
  isDurationBased = false,
  onUpdate,
  onDelete,
  onCompleteSet
}) => {
  const handleRepsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value, 10);
    onUpdate({
      ...set,
      reps: isNaN(val) ? 0 : val
    });
  };

  const handleWeightChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    onUpdate({
      ...set,
      weight: isNaN(val) ? 0 : val
    });
  };

  const handleToggleCompleted = () => {
    const nextCompleted = !set.completed;
    onUpdate({
      ...set,
      completed: nextCompleted
    });
    if (nextCompleted) {
      onCompleteSet(set.id);
    }
  };

  return (
    <div className={`${styles.setRow} ${set.completed ? styles.completed : ''}`}>
      {/* 1. Hiệp */}
      <span className={styles.setIndex}>{index + 1}</span>

      {/* 2. Trước đó */}
      <span className={styles.previousRecord} title="Thành tích lần trước">
        {previousPerformance}
      </span>

      {/* 3. Khối lượng kg */}
      <div className={styles.inputGroup}>
        <input
          type="number"
          min="0"
          step="0.5"
          value={set.weight === 0 ? '' : set.weight}
          placeholder={isBodyweight ? 'BW' : '0'}
          onChange={handleWeightChange}
          className={styles.input}
          aria-label={isBodyweight ? 'Tạ thêm (nếu có)' : 'Khối lượng tạ'}
        />
        <span className={styles.unit}>{isBodyweight ? 'kg+' : 'kg'}</span>
      </div>

      {/* 4. Số lần lặp hoặc giây */}
      <div className={styles.inputGroup}>
        <input
          type="number"
          min="0"
          step="1"
          value={set.reps === 0 ? '' : set.reps}
          placeholder={isDurationBased ? '30' : '0'}
          onChange={handleRepsChange}
          className={styles.input}
          aria-label={isDurationBased ? 'Thời gian (giây)' : 'Số lần lặp (reps)'}
        />
        <span className={styles.unit}>{isDurationBased ? 's' : 'lần'}</span>
      </div>

      {/* 5. Nút Check hoàn thành tròn GymWork style */}
      <button
        type="button"
        className={`${styles.checkBtn} ${set.completed ? styles.checked : ''}`}
        onClick={handleToggleCompleted}
        aria-label={set.completed ? 'Đánh dấu chưa hoàn thành' : 'Đánh dấu hoàn thành'}
      >
        {set.completed ? '✓' : ''}
      </button>

      {/* 6. Nút xóa hiệp nhỏ gọn */}
      <button
        type="button"
        className={styles.deleteBtn}
        onClick={() => onDelete(set.id)}
        aria-label="Xóa hiệp tập"
        title="Xóa hiệp"
      >
        ✕
      </button>
    </div>
  );
};
