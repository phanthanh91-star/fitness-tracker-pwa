import React from 'react';
import styles from './ExerciseCard.module.css';
import { Exercise } from '../../types';

interface ExerciseCardProps {
  exercise: Exercise;
  isFavorite?: boolean;
  onToggleFavorite?: () => void;
  onClick?: () => void;
  actionButton?: React.ReactNode;
}

export const ExerciseCard: React.FC<ExerciseCardProps> = ({
  exercise,
  isFavorite,
  onToggleFavorite,
  onClick,
  actionButton
}) => {
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Ngực': return '🏋️';
      case 'Lưng': return '🧗';
      case 'Chân': return '🦵';
      case 'Vai': return '🦾';
      case 'Tay': return '💪';
      case 'Thể Trọng': return '🤸';
      default: return '⚡';
    }
  };

  return (
    <div className={styles.card} onClick={onClick}>
      <div className={styles.leftContent}>
        <div className={styles.thumb}>
          <span>{getCategoryIcon(exercise.category)}</span>
        </div>
        <div className={styles.infoCol}>
          <div className={styles.nameRow}>
            <h4 className={styles.title}>{exercise.name}</h4>
          </div>
          <div className={styles.subText}>
            <span className={styles.categoryName}>{exercise.category}</span>
            <span className={styles.dot}>•</span>
            <span className={styles.muscles}>{exercise.muscleGroups.join(', ')}</span>
          </div>
        </div>
      </div>

      <div className={styles.rightContent} onClick={(e) => e.stopPropagation()}>
        {onToggleFavorite && (
          <button
            type="button"
            className={`${styles.favoriteBtn} ${isFavorite ? styles.favoriteBtnActive : ''}`}
            onClick={(e) => {
              e.stopPropagation();
              onToggleFavorite();
            }}
            title={isFavorite ? 'Bỏ yêu thích' : 'Thêm vào yêu thích'}
          >
            {isFavorite ? '★' : '☆'}
          </button>
        )}
        {actionButton}
      </div>
    </div>
  );
};
