import React from 'react';
import styles from './SetRow.module.css';
import { WorkoutSet } from '../../types';

interface SetRowProps {
  index: number;
  set: WorkoutSet;
  isBodyweight?: boolean;
  isDurationBased?: boolean;
  onUpdate: (updatedSet: WorkoutSet) => void;
  onDelete: (setId: string) => void;
  onCompleteSet: (setId: string) => void;
}

export const SetRow: React.FC<SetRowProps> = ({
  index,
  set,
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
      <span className={styles.setIndex}>{index + 1}</span>

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
        <span className={styles.unit}>{isDurationBased ? 'giây' : 'reps'}</span>
      </div>

      <button
        type="button"
        className={`${styles.checkBtn} ${set.completed ? styles.checked : ''}`}
        onClick={handleToggleCompleted}
        aria-label={set.completed ? 'Đánh dấu chưa hoàn thành' : 'Đánh dấu hoàn thành'}
      >
        {set.completed ? '✓' : '○'}
      </button>

      <button
        type="button"
        className={styles.deleteBtn}
        onClick={() => onDelete(set.id)}
        aria-label="Xóa hiệp tập"
      >
        ✕
      </button>
    </div>
  );
};
