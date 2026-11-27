import React, { useState, useEffect } from 'react';
import styles from './Library.module.css';
import { Exercise, NavTab, WorkoutSession } from '../../types';
import { INITIAL_EXERCISES } from '../../data/exercises';
import { ExerciseCard } from '../../components/ExerciseCard/ExerciseCard';

interface LibraryProps {
  favoriteExerciseIds?: string[];
  workouts?: WorkoutSession[];
  onToggleFavorite?: (exerciseId: string) => void;
  onAddToWorkout?: (exercise: Exercise) => void;
  onNavigate?: (tab: NavTab) => void;
}

export const Library: React.FC<LibraryProps> = ({
  favoriteExerciseIds = [],
  workouts = [],
  onToggleFavorite,
  onAddToWorkout,
  onNavigate
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('Tất cả');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [detailExercise, setDetailExercise] = useState<Exercise | null>(null);
  const [modalTab, setModalTab] = useState<'instructions' | 'history'>('instructions');
  const [gifLoaded, setGifLoaded] = useState<boolean>(false);
  const [gifError, setGifError] = useState<boolean>(false);

  // Ẩn thanh bottomNav và chống cuộn nền khi mở modal
  useEffect(() => {
    if (detailExercise) {
      document.body.classList.add('modal-open');
    } else {
      document.body.classList.remove('modal-open');
    }
    return () => {
      document.body.classList.remove('modal-open');
    };
  }, [detailExercise]);

  // Reset trạng thái ảnh GIF khi đổi bài tập
  useEffect(() => {
    setGifLoaded(false);
    setGifError(false);
  }, [detailExercise?.id]);

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
    const aFav = favoriteExerciseIds.includes(a.id);
    const bFav = favoriteExerciseIds.includes(b.id);
    if (aFav && !bFav) return -1;
    if (!aFav && bFav) return 1;
    return 0;
  });

  // Tìm lịch sử tập của bài tập được chọn
  const exerciseHistory = detailExercise
    ? workouts
        .filter((session) => session.exercises.some((e) => e.exerciseId === detailExercise.id))
        .map((session) => {
          const exData = session.exercises.find((e) => e.exerciseId === detailExercise.id);
          const maxWeight = exData
            ? Math.max(0, ...exData.sets.map((s) => s.weight))
            : 0;
          return {
            date: session.date,
            sets: exData?.sets || [],
            maxWeight
          };
        })
    : [];

  // Phân loại cơ chính và cơ phụ
  const primaryMuscle = detailExercise ? detailExercise.muscleGroups[0] : '';
  const secondaryMuscles = detailExercise ? detailExercise.muscleGroups.slice(1) : [];

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Thư viện bài tập</h1>
      </div>

      {/* Tìm kiếm */}
      <div className={styles.searchBox}>
        <span className={styles.searchIcon}>🔍</span>
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
            onClick={() => {
              setDetailExercise(exercise);
              setModalTab('instructions');
            }}
          />
        ))}
      </div>

      {/* Modal chi tiết bài tập (Screenshot 4: Hevy / GymWork Style) */}
      {detailExercise && (
        <div
          className={styles.modalBackdrop}
          onClick={() => setDetailExercise(null)}
        >
          <div
            className={styles.modalContent}
            onClick={(e) => e.stopPropagation()}
          >
            <div className={styles.dragHandle} />

            <div className={styles.modalTop}>
              <div>
                <h2 className={styles.modalExerciseName}>{detailExercise.name}</h2>
                <div className={styles.modalCategoryRow}>
                  <span className={styles.badgeCategory}>{detailExercise.category}</span>
                  {detailExercise.isBodyweight && (
                    <span className={styles.badgeBodyweight}>Thể trọng</span>
                  )}
                  {detailExercise.isDurationBased && (
                    <span className={styles.badgeDuration}>Giữ theo giây</span>
                  )}
                </div>
              </div>
              <button
                type="button"
                className={styles.modalCloseBtn}
                onClick={() => setDetailExercise(null)}
              >
                ✕
              </button>
            </div>

            {/* Khu vực nội dung cuộn mượt mà */}
            <div className={styles.modalScrollArea}>
              {/* Ảnh GIF minh họa động tác (ẩn hoàn toàn nếu lỗi, có skeleton khi tải) */}
              {detailExercise.gifUrl && !gifError && (
                <div className={`${styles.gifContainer} ${gifLoaded ? styles.gifLoaded : ''}`}>
                  {!gifLoaded && (
                    <div className={styles.gifSkeleton}>
                      <span className={styles.gifSpinner}>🎬</span>
                      <span>Đang tải hướng dẫn động tác...</span>
                    </div>
                  )}
                  <img
                    src={detailExercise.gifUrl}
                    alt={`Hướng dẫn ${detailExercise.name}`}
                    className={`${styles.gifImage} ${gifLoaded ? styles.gifImageVisible : ''}`}
                    loading="lazy"
                    referrerPolicy="no-referrer"
                    onLoad={() => setGifLoaded(true)}
                    onError={() => setGifError(true)}
                  />
                </div>
              )}

              {/* Segmented Control: [ Hướng dẫn ] vs [ Lịch sử ] */}
              <div className={styles.tabSegments}>
                <button
                  type="button"
                  className={`${styles.tabBtn} ${modalTab === 'instructions' ? styles.tabBtnActive : ''}`}
                  onClick={() => setModalTab('instructions')}
                >
                  Hướng dẫn
                </button>
                <button
                  type="button"
                  className={`${styles.tabBtn} ${modalTab === 'history' ? styles.tabBtnActive : ''}`}
                  onClick={() => setModalTab('history')}
                >
                  Lịch sử ({exerciseHistory.length})
                </button>
              </div>

              {/* Nội dung Tab Hướng dẫn */}
              {modalTab === 'instructions' ? (
                <div className={styles.tabBody}>
                  {/* Giải phẫu cơ tham gia */}
                  <div className={styles.muscleAnatomySection}>
                    <div className={styles.sectionTitle}>Nhóm cơ tác động</div>
                    <div className={styles.muscleBadgeRow}>
                      <div className={styles.primaryMuscleBadge}>
                        <span className={styles.muscleTagPrefix}>Chính:</span>
                        <span>{primaryMuscle}</span>
                      </div>
                      {secondaryMuscles.map((m) => (
                        <div key={m} className={styles.secondaryMuscleBadge}>
                          <span className={styles.muscleTagPrefix}>Phụ:</span>
                          <span>{m}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <p className={styles.modalDescription}>{detailExercise.description}</p>

                  {/* Các bước kỹ thuật */}
                  <div className={styles.instructionSection}>
                    <div className={styles.sectionTitle}>Các bước thực hiện:</div>
                    {detailExercise.instructions.map((step, idx) => (
                      <div key={idx} className={styles.instructionStep}>
                        <div className={styles.stepNumber}>{idx + 1}</div>
                        <div className={styles.stepText}>{step}</div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                /* Nội dung Tab Lịch sử */
                <div className={styles.tabBody}>
                  {exerciseHistory.length === 0 ? (
                    <div className={styles.emptyHistoryBox}>
                      <span className={styles.emptyHistoryIcon}>📊</span>
                      <div className={styles.emptyHistoryTitle}>Chưa có lịch sử tập</div>
                      <p className={styles.emptyHistoryDesc}>
                        Hãy thêm bài tập này vào buổi tập và hoàn thành các hiệp để theo dõi tiến độ mức tạ tại đây.
                      </p>
                    </div>
                  ) : (
                    <div className={styles.historyList}>
                      {exerciseHistory.map((item, idx) => {
                        const d = new Date(item.date);
                        const dateStr = d.toLocaleDateString('vi-VN', {
                          weekday: 'short',
                          day: 'numeric',
                          month: 'numeric',
                          year: 'numeric'
                        });
                        return (
                          <div key={idx} className={styles.historyItem}>
                            <div className={styles.historyItemTop}>
                              <span className={styles.historyDate}>{dateStr}</span>
                              {item.maxWeight > 0 && (
                                <span className={styles.historyMaxWeight}>
                                  Max: {item.maxWeight} kg
                                </span>
                              )}
                            </div>
                            <div className={styles.historySetsRow}>
                              {item.sets.map((s, sIdx) => (
                                <span key={s.id || sIdx} className={styles.historySetPill}>
                                  H{sIdx + 1}: {s.weight > 0 ? `${s.weight}kg × ` : ''}{s.reps}{detailExercise.isDurationBased ? 's' : ''}
                                </span>
                              ))}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Nút thêm vào buổi tập cố định dưới đáy sheet */}
            {onAddToWorkout && (
              <div className={styles.modalFooter}>
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
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
