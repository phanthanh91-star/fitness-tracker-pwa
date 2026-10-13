import React, { useState } from 'react';
import styles from './Library.module.css';
import { Exercise, NavTab } from '../../types';
import { INITIAL_EXERCISES } from '../../data/exercises';
import { ExerciseCard } from '../../components/ExerciseCard/ExerciseCard';

interface LibraryProps {
  favoriteExerciseIds?: string[];
  onToggleFavorite?: (exerciseId: string) => void;
  onAddToWorkout?: (exercise: Exercise) => void;
  onNavigate?: (tab: NavTab) => void;
}

export const Library: React.FC<LibraryProps> = ({
  favoriteExerciseIds = [],
  onToggleFavorite,
  onAddToWorkout,
  onNavigate
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('Tất cả');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [detailExercise, setDetailExercise] = useState<Exercise | null>(null);

  const categories = ['Tất cả', '★ Yêu thích', 'Thể Trọng', 'Ngực', 'Lưng', 'Chân', 'Vai', 'Tay'];

  const filteredExercises = INITIAL_EXERCISES.filter((ex) => {
    let matchesCategory = true;
    if (selectedCategory === '★ Yêu thích') {
      matchesCategory = favoriteExerciseIds.includes(ex.id);
    } else if (selectedCategory !== 'Tất cả') {
      matchesCategory = ex.category === selectedCategory;
    }

    const matchesSearch =
      ex.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ex.muscleGroups.some((mg) => mg.toLowerCase().includes(searchQuery.toLowerCase())) ||
      ex.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  }).sort((a, b) => {
    // Ưu tiên đưa bài yêu thích lên đầu trong danh sách
    const aFav = favoriteExerciseIds.includes(a.id);
    const bFav = favoriteExerciseIds.includes(b.id);
    if (aFav && !bFav) return -1;
    if (!aFav && bFav) return 1;
    return 0;
  });

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Thư viện bài tập</h1>
      </div>

      {/* Tìm kiếm */}
      <div className={styles.searchBox}>
        <span>🔍</span>
        <input
          type="text"
          className={styles.searchInput}
          placeholder="Tìm bài tập theo tên hoặc nhóm cơ..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Thanh phân loại nhóm cơ */}
      <div className={styles.categoriesBar}>
        {categories.map((cat) => (
          <button
            key={cat}
            type="button"
            className={`${styles.categoryBtn} ${selectedCategory === cat ? styles.categoryBtnActive : ''}`}
            onClick={() => setSelectedCategory(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Danh sách bài tập dạng Card */}
      <div className={styles.exerciseList}>
        {filteredExercises.map((exercise) => (
          <ExerciseCard
            key={exercise.id}
            exercise={exercise}
            isFavorite={favoriteExerciseIds.includes(exercise.id)}
            onToggleFavorite={onToggleFavorite ? () => onToggleFavorite(exercise.id) : undefined}
            onClick={() => setDetailExercise(exercise)}
          />
        ))}
      </div>

      {/* Modal chi tiết bài tập */}
      {detailExercise && (
        <div
          className={styles.modalBackdrop}
          onClick={() => setDetailExercise(null)}
        >
          <div
            className={styles.modalContent}
            onClick={(e) => e.stopPropagation()}
          >
            <div className={styles.modalTop}>
              <div>
                <h2 className={styles.modalExerciseName}>{detailExercise.name}</h2>
                <span
                  style={{
                    color: 'var(--accent-color, #ff6b35)',
                    fontSize: '13px',
                    fontWeight: 600
                  }}
                >
                  Nhóm cơ: {detailExercise.category} ({detailExercise.muscleGroups.join(', ')})
                </span>
              </div>
              <button
                type="button"
                className={styles.modalCloseBtn}
                onClick={() => setDetailExercise(null)}
              >
                ✕
              </button>
            </div>

            <p className={styles.modalDescription}>{detailExercise.description}</p>

            <div className={styles.instructionSection}>
              <div className={styles.sectionHeader}>Hướng dẫn kỹ thuật:</div>
              {detailExercise.instructions.map((step, idx) => (
                <div key={idx} className={styles.instructionStep}>
                  <div className={styles.stepNumber}>{idx + 1}</div>
                  <div>{step}</div>
                </div>
              ))}
            </div>

            {onAddToWorkout && (
              <button
                type="button"
                className={styles.addToWorkoutBtn}
                onClick={() => {
                  onAddToWorkout(detailExercise);
                  setDetailExercise(null);
                  if (onNavigate) {
                    onNavigate('active');
                  }
                }}
              >
                + Thêm vào buổi tập ngay
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
