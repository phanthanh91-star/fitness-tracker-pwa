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
  const getBadgeClass = (category: string) => {
    switch (category) {
      case 'Ngực': return styles.badgeChest;
      case 'Lưng': return styles.badgeBack;
      case 'Chân': return styles.badgeLegs;
      case 'Vai': return styles.badgeShoulders;
      case 'Tay': return styles.badgeArms;
      case 'Thể Trọng': return styles.badgeBodyweight;
      default: return '';
    }
  };

  return (
    <div className={styles.card} onClick={onClick}>
      <div className={styles.header}>
        <div className={styles.titleRow}>
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
          <h4 className={styles.title}>{exercise.name}</h4>
        </div>
        <span className={`${styles.categoryBadge} ${getBadgeClass(exercise.category)}`}>
          {exercise.category}
        </span>
      </div>

      <p className={styles.description}>{exercise.description}</p>

      <div className={styles.muscleGroups}>
        {exercise.muscleGroups.map((group) => (
          <span key={group} className={styles.muscleTag}>
            {group}
          </span>
        ))}
      </div>

      {actionButton && (
        <div onClick={(e) => e.stopPropagation()} style={{ marginTop: '8px' }}>
          {actionButton}
        </div>
      )}
    </div>
  );
};
