import React, { useState, useEffect } from 'react';
import styles from './ActiveWorkout.module.css';
import { Exercise, WorkoutExercise, WorkoutSet, WorkoutSession, NavTab } from '../../types';
import { INITIAL_EXERCISES, isExerciseBodyweight } from '../../data/exercises';
import { SetRow } from '../../components/SetRow/SetRow';
import { RestTimer } from '../../components/RestTimer/RestTimer';

interface ActiveWorkoutProps {
  activeExercises: WorkoutExercise[];
  setActiveExercises: React.Dispatch<React.SetStateAction<WorkoutExercise[]>>;
  activeStartTime: number | null;
  setActiveStartTime: React.Dispatch<React.SetStateAction<number | null>>;
  onSaveWorkout: (session: Omit<WorkoutSession, 'id'>) => void;
  onNavigate: (tab: NavTab) => void;
}

export const ActiveWorkout: React.FC<ActiveWorkoutProps> = ({
  activeExercises,
  setActiveExercises,
  activeStartTime,
  setActiveStartTime,
  onSaveWorkout,
  onNavigate
}) => {
  const [elapsedSeconds, setElapsedSeconds] = useState<number>(0);
  const [notes, setNotes] = useState<string>('');
  const [isExercisePickerOpen, setIsExercisePickerOpen] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('Tất cả');
  const [isRestTimerOpen, setIsRestTimerOpen] = useState<boolean>(false);
  const [restTimerSeconds, setRestTimerSeconds] = useState<number>(60);

  // Khởi động đồng hồ thời gian tập
  useEffect(() => {
    if (!activeStartTime) {
      const now = Date.now();
      setActiveStartTime(now);
    }
  }, [activeStartTime, setActiveStartTime]);

  useEffect(() => {
    const interval = window.setInterval(() => {
      if (activeStartTime) {
        setElapsedSeconds(Math.floor((Date.now() - activeStartTime) / 1000));
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [activeStartTime]);

  const formatTimer = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const s = secs % 60;
    return `${String(mins).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  // Thêm bài tập vào buổi tập hiện tại
  const handleAddExercise = (exercise: Exercise) => {
    // Nếu bài tập đã có thì không thêm trùng
    if (activeExercises.some((e) => e.exerciseId === exercise.id)) {
      setIsExercisePickerOpen(false);
      return;
    }

    const newWorkoutEx: WorkoutExercise = {
      exerciseId: exercise.id,
      exerciseName: exercise.name,
      sets: [
        {
          id: 'set-' + Date.now() + '-1',
          weight: 0,
          reps: 10,
          completed: false,
          restTime: 60
        }
      ]
    };

    setActiveExercises((prev) => [...prev, newWorkoutEx]);
    setIsExercisePickerOpen(false);
  };

  // Xóa bài tập khỏi buổi tập
  const handleRemoveExercise = (exerciseId: string) => {
    setActiveExercises((prev) => prev.filter((e) => e.exerciseId !== exerciseId));
  };

  // Thêm một hiệp (set) mới cho bài tập
  const handleAddSet = (exerciseId: string) => {
    setActiveExercises((prev) =>
      prev.map((ex) => {
        if (ex.exerciseId !== exerciseId) return ex;
        const lastSet = ex.sets[ex.sets.length - 1];
        const newSet: WorkoutSet = {
          id: 'set-' + Date.now() + '-' + (ex.sets.length + 1),
          weight: lastSet ? lastSet.weight : 0,
          reps: lastSet ? lastSet.reps : 10,
          completed: false,
          restTime: 60
        };
        return {
          ...ex,
          sets: [...ex.sets, newSet]
        };
      })
    );
  };

  // Cập nhật thông số của hiệp
  const handleUpdateSet = (exerciseId: string, updatedSet: WorkoutSet) => {
    setActiveExercises((prev) =>
      prev.map((ex) => {
        if (ex.exerciseId !== exerciseId) return ex;
        return {
          ...ex,
          sets: ex.sets.map((s) => (s.id === updatedSet.id ? updatedSet : s))
        };
      })
    );
  };

  // Xóa một hiệp
  const handleDeleteSet = (exerciseId: string, setId: string) => {
    setActiveExercises((prev) =>
      prev.map((ex) => {
        if (ex.exerciseId !== exerciseId) return ex;
        return {
          ...ex,
          sets: ex.sets.filter((s) => s.id !== setId)
        };
      })
    );
  };

  // Xử lý khi hoàn thành hiệp tập -> Bật Rest Timer
  const handleCompleteSet = (_setId: string) => {
    setRestTimerSeconds(60);
    setIsRestTimerOpen(true);
  };

  // Kết thúc buổi tập
  const handleFinishWorkout = () => {
    if (activeExercises.length === 0) {
      alert('Vui lòng thêm ít nhất một bài tập trước khi kết thúc!');
      return;
    }

    const sessionData: Omit<WorkoutSession, 'id'> = {
      date: new Date().toISOString(),
      duration: elapsedSeconds,
      exercises: activeExercises,
      notes: notes.trim() ? notes.trim() : undefined
    };

    onSaveWorkout(sessionData);
    onNavigate('history');
  };

  // Hủy buổi tập
  const handleCancelWorkout = () => {
    if (window.confirm('Bạn có chắc muốn hủy buổi tập hiện tại? Dữ liệu chưa lưu sẽ bị xóa.')) {
      setActiveExercises([]);
      setActiveStartTime(null);
      setElapsedSeconds(0);
      onNavigate('home');
    }
  };

  // Danh mục lọc trong modal
  const categories = ['Tất cả', 'Thể Trọng', 'Ngực', 'Lưng', 'Chân', 'Vai', 'Tay'];

  const filteredExercises = INITIAL_EXERCISES.filter((ex) => {
    const matchCat = selectedCategory === 'Tất cả' || ex.category === selectedCategory;
    const matchSearch =
      ex.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ex.muscleGroups.some((mg) => mg.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchCat && matchSearch;
  });

  return (
    <div className={styles.container}>
      {/* Thanh trên cùng: Thời gian & nút Hoàn thành */}
      <div className={styles.topBar}>
        <div className={styles.durationBox}>
          <span className={styles.clockIcon}>⏱️</span>
          <span className={styles.timeText}>{formatTimer(elapsedSeconds)}</span>
        </div>

        <button
          type="button"
          className={styles.finishBtn}
          onClick={handleFinishWorkout}
        >
          Hoàn thành ✓
        </button>
      </div>

      {/* Danh sách các bài tập đang tập */}
      {activeExercises.map((exercise) => {
        const isBw = isExerciseBodyweight(exercise.exerciseId);
        return (
          <div key={exercise.exerciseId} className={styles.exerciseBlock}>
            <div className={styles.exerciseHeader}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <h3 className={styles.exerciseTitle}>{exercise.exerciseName}</h3>
                {isBw && (
                  <span
                    style={{
                      fontSize: '11px',
                      padding: '2px 8px',
                      borderRadius: '12px',
                      backgroundColor: 'rgba(255, 107, 53, 0.15)',
                      color: 'var(--accent-color, #ff6b35)',
                      fontWeight: 600,
                      border: '1px solid rgba(255, 107, 53, 0.3)'
                    }}
                  >
                    Thể trọng
                  </span>
                )}
              </div>
              <button
                type="button"
                className={styles.removeExerciseBtn}
                onClick={() => handleRemoveExercise(exercise.exerciseId)}
              >
                Bỏ bài tập
              </button>
            </div>

            <div className={styles.setTableHeader}>
              <span className={styles.textCenter}>Hiệp</span>
              <span className={styles.textCenter}>{isBw ? 'Tạ thêm' : 'Khối lượng'}</span>
              <span className={styles.textCenter}>Số lần</span>
              <span className={styles.textCenter}>Xong</span>
              <span />
            </div>

            <div className={styles.setsList}>
              {exercise.sets.map((set, setIdx) => (
                <SetRow
                  key={set.id}
                  index={setIdx}
                  set={set}
                  isBodyweight={isBw}
                  onUpdate={(updated) => handleUpdateSet(exercise.exerciseId, updated)}
                  onDelete={(id) => handleDeleteSet(exercise.exerciseId, id)}
                  onCompleteSet={handleCompleteSet}
                />
              ))}
            </div>

            <button
              type="button"
              className={styles.addSetBtn}
              onClick={() => handleAddSet(exercise.exerciseId)}
            >
              <span>+</span>
              <span>Thêm hiệp tập</span>
            </button>
          </div>
        );
      })}

      {/* Nút thêm bài tập */}
      <button
        type="button"
        className={styles.addExerciseBtn}
        onClick={() => setIsExercisePickerOpen(true)}
      >
        <span>+</span>
        <span>Thêm bài tập vào buổi tập</span>
      </button>

      {/* Ghi chú buổi tập */}
      <div className={styles.notesCard}>
        <textarea
          className={styles.notesInput}
          placeholder="Ghi chú buổi tập hôm nay (cảm nhận cơ, thể lực, tạ nâng...)..."
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />
      </div>

      {/* Nút hủy buổi tập */}
      <div className={styles.bottomActionRow}>
        <button
          type="button"
          className={styles.cancelWorkoutBtn}
          onClick={handleCancelWorkout}
        >
          Hủy buổi tập này
        </button>
      </div>

      {/* Bộ đếm giờ nghỉ */}
      <RestTimer
        isOpen={isRestTimerOpen}
        initialSeconds={restTimerSeconds}
        onClose={() => setIsRestTimerOpen(false)}
      />

      {/* Modal chọn bài tập */}
      {isExercisePickerOpen && (
        <div
          className={styles.modalBackdrop}
          onClick={() => setIsExercisePickerOpen(false)}
        >
          <div
            className={styles.modalSheet}
            onClick={(e) => e.stopPropagation()}
          >
            <div className={styles.dragHandle} />
            <div className={styles.modalHeader}>
              <h3 className={styles.modalTitle}>Chọn bài tập</h3>
              <button
                type="button"
                className={styles.modalClose}
                onClick={() => setIsExercisePickerOpen(false)}
              >
                ✕
              </button>
            </div>

            <div className={styles.searchBox}>
              <span>🔍</span>
              <input
                type="text"
                className={styles.searchInput}
                placeholder="Tìm bài tập theo tên hoặc nhóm cơ..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                autoFocus
              />
            </div>

            <div className={styles.categoryPills}>
              {categories.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  className={`${styles.pill} ${selectedCategory === cat ? styles.pillActive : ''}`}
                  onClick={() => setSelectedCategory(cat)}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div className={styles.exerciseSelectList}>
              {filteredExercises.map((ex) => {
                const isSelected = activeExercises.some((e) => e.exerciseId === ex.id);
                return (
                  <div
                    key={ex.id}
                    className={styles.selectItem}
                    onClick={() => handleAddExercise(ex)}
                  >
                    <div>
                      <div className={styles.selectItemName}>{ex.name}</div>
                      <div className={styles.selectItemCat}>
                        {ex.category} • {ex.muscleGroups.join(', ')}
                      </div>
                    </div>
                    {isSelected && (
                      <span style={{ color: '#2ea043', fontSize: '13px', fontWeight: 600 }}>
                        Đã chọn ✓
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
