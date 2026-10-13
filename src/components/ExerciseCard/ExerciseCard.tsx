import React from 'react';
import styles from './ExerciseCard.module.css';
import { Exercise } from '../../types';

interface ExerciseCardProps {
  exercise: Exercise;
  onClick?: () => void;
  actionButton?: React.ReactNode;
}

export const ExerciseCard: React.FC<ExerciseCardProps> = ({
  exercise,
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
        <h4 className={styles.title}>{exercise.name}</h4>
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
