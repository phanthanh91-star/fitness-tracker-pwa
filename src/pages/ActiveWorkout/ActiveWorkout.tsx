import React, { useState, useEffect, useMemo } from 'react';
import styles from './ActiveWorkout.module.css';
import { Exercise, WorkoutExercise, WorkoutSet, WorkoutSession, NavTab } from '../../types';
import { INITIAL_EXERCISES, isExerciseBodyweight, isExerciseDurationBased } from '../../data/exercises';
import { SetRow } from '../../components/SetRow/SetRow';
import { RestTimer } from '../../components/RestTimer/RestTimer';

interface ActiveWorkoutProps {
  activeExercises: WorkoutExercise[];
  setActiveExercises: React.Dispatch<React.SetStateAction<WorkoutExercise[]>>;
  activeStartTime: number | null;
  setActiveStartTime: React.Dispatch<React.SetStateAction<number | null>>;
  favoriteExerciseIds?: string[];
  workouts?: WorkoutSession[];
  onSaveWorkout: (session: Omit<WorkoutSession, 'id'>) => void;
  onNavigate: (tab: NavTab) => void;
}

export const ActiveWorkout: React.FC<ActiveWorkoutProps> = ({
  activeExercises,
  setActiveExercises,
  activeStartTime,
  setActiveStartTime,
  favoriteExerciseIds = [],
  workouts = [],
  onSaveWorkout,
  onNavigate
}) => {
  const [elapsedSeconds, setElapsedSeconds] = useState<number>(0);
  const [notes, setNotes] = useState<string>('');
  const [isExercisePickerOpen, setIsExercisePickerOpen] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('Tất cả');
  const [selectedEquipment, setSelectedEquipment] = useState<string>('Tất cả');
  const [isRestTimerOpen, setIsRestTimerOpen] = useState<boolean>(false);
  const [restTimerSeconds, setRestTimerSeconds] = useState<number>(90);

  // Bottom Sheet tùy chọn bài tập (3 chấm ⋮)
  const [actionSheetExerciseId, setActionSheetExerciseId] = useState<string | null>(null);

  // Đổi bài tập (Swap ⇄)
  const [swappingExerciseId, setSwappingExerciseId] = useState<string | null>(null);

  // Ghi chú riêng từng bài tập (inline note)
  const [exerciseNotes, setExerciseNotes] = useState<{ [id: string]: string }>({});
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);

  // Modal tổng kết buổi tập (Screenshot 1: GymWork Summary Card)
  const [showSummaryModal, setShowSummaryModal] = useState<boolean>(false);
  const [summaryData, setSummaryData] = useState<{
    duration: number;
    volume: number;
    calories: number;
    totalSets: number;
    exercises: WorkoutExercise[];
  } | null>(null);

  // Đếm thời gian khi activeStartTime != null
  useEffect(() => {
    if (!activeStartTime) {
      setElapsedSeconds(0);
      return;
    }

    setElapsedSeconds(Math.floor((Date.now() - activeStartTime) / 1000));
    const interval = window.setInterval(() => {
      setElapsedSeconds(Math.floor((Date.now() - activeStartTime) / 1000));
    }, 1000);

    return () => clearInterval(interval);
  }, [activeStartTime]);

  const handleStartWorkout = () => {
    setActiveStartTime(Date.now());
  };

  const formatTimer = (secs: number) => {
    const hrs = Math.floor(secs / 3600);
    const mins = Math.floor((secs % 3600) / 60);
    const s = secs % 60;
    if (hrs > 0) {
      return `${String(hrs).padStart(2, '0')}:${String(mins).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
    }
    return `${String(mins).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  // Tính toán 4 chỉ số thống kê trên thanh Top Bar (Screenshot 5)
  const stats = useMemo(() => {
    let completedSetsCount = 0;
    let totalSetsCount = 0;
    let volumeKg = 0;

    activeExercises.forEach((ex) => {
      ex.sets.forEach((set) => {
        totalSetsCount++;
        if (set.completed) {
          completedSetsCount++;
          if (set.weight > 0) {
            volumeKg += set.weight * set.reps;
          }
        }
      });
    });

    // Ước tính calo tiêu hao dựa trên thời gian, số hiệp và khối lượng nâng
    const calo = Math.round(
      (elapsedSeconds * 0.12) +
      (completedSetsCount * 7.5) +
      (volumeKg > 0 ? volumeKg * 0.012 : 0)
    );

    return {
      volume: Math.round(volumeKg),
      calories: calo,
      completedSets: completedSetsCount,
      totalSets: totalSetsCount
    };
  }, [activeExercises, elapsedSeconds]);

  // Tìm thành tích lần tập trước (Cột "TRƯỚC ĐÓ" trong GymWork)
  const getPreviousPerformance = (exerciseId: string, setIndex: number): string => {
    for (const session of workouts) {
      const ex = session.exercises.find((e) => e.exerciseId === exerciseId);
      if (ex && ex.sets.length > 0) {
        const prevSet = ex.sets[setIndex] || ex.sets[ex.sets.length - 1];
        if (prevSet && prevSet.completed) {
          if (prevSet.weight > 0) {
            return `${prevSet.weight}kg × ${prevSet.reps}`;
          }
          return `${prevSet.reps} lần`;
        }
      }
    }
    return '-';
  };

  // Icon nhóm cơ
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

  // Thêm hoặc thay thế bài tập
  const handleSelectExercise = (exercise: Exercise) => {
    if (swappingExerciseId) {
      // Thay thế bài tập hiện tại bằng bài mới
      setActiveExercises((prev) =>
        prev.map((ex) => {
          if (ex.exerciseId === swappingExerciseId) {
            return {
              exerciseId: exercise.id,
              exerciseName: exercise.name,
              sets: ex.sets.map((s) => ({ ...s, completed: false }))
            };
          }
          return ex;
        })
      );
      setSwappingExerciseId(null);
      setIsExercisePickerOpen(false);
      return;
    }

    // Thêm mới
    if (activeExercises.some((e) => e.exerciseId === exercise.id)) {
      setIsExercisePickerOpen(false);
      return;
    }

    const isDuration = isExerciseDurationBased(exercise.id);
    const newWorkoutEx: WorkoutExercise = {
      exerciseId: exercise.id,
      exerciseName: exercise.name,
      sets: [
        {
          id: 'set-' + Date.now() + '-1',
          weight: 0,
          reps: isDuration ? 30 : 10,
          completed: false,
          restTime: 90
        }
      ]
    };

    setActiveExercises((prev) => [...prev, newWorkoutEx]);
    setIsExercisePickerOpen(false);
  };

  // Xóa bài tập
  const handleRemoveExercise = (exerciseId: string) => {
    setActiveExercises((prev) => prev.filter((e) => e.exerciseId !== exerciseId));
    setActionSheetExerciseId(null);
  };

  // Thêm một hiệp (set)
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
          restTime: 90
        };
        return {
          ...ex,
          sets: [...ex.sets, newSet]
        };
      })
    );
  };

  // Giảm bớt 1 hiệp cuối cùng
  const handleRemoveLastSet = (exerciseId: string) => {
    setActiveExercises((prev) =>
      prev.map((ex) => {
        if (ex.exerciseId !== exerciseId || ex.sets.length <= 1) return ex;
        return {
          ...ex,
          sets: ex.sets.slice(0, ex.sets.length - 1)
        };
      })
    );
  };

  // Cập nhật hiệp
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

  // Xóa một hiệp cụ thể
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

  // Khi bấm hoàn thành hiệp tập -> Bật Rest Timer
  const handleCompleteSet = (_setId: string) => {
    setRestTimerSeconds(90);
    setIsRestTimerOpen(true);
  };

  // Đổi thứ tự bài tập lên / xuống
  const handleMoveExercise = (exerciseId: string, direction: 'up' | 'down') => {
    const idx = activeExercises.findIndex((e) => e.exerciseId === exerciseId);
    if (idx === -1) return;
    const targetIdx = direction === 'up' ? idx - 1 : idx + 1;
    if (targetIdx < 0 || targetIdx >= activeExercises.length) return;

    const updated = [...activeExercises];
    const [moved] = updated.splice(idx, 1);
    updated.splice(targetIdx, 0, moved);
    setActiveExercises(updated);
    setActionSheetExerciseId(null);
  };

  // Người dùng bấm "Xong" -> Mở Modal tổng kết (Screenshot 1)
  const handleOpenFinishModal = () => {
    if (activeExercises.length === 0) {
      alert('Vui lòng thêm ít nhất một bài tập trước khi kết thúc!');
      return;
    }

    setSummaryData({
      duration: elapsedSeconds,
      volume: stats.volume,
      calories: stats.calories,
      totalSets: stats.completedSets,
      exercises: activeExercises
    });
    setShowSummaryModal(true);
  };

  // Xác nhận lưu buổi tập từ modal tổng kết
  const handleConfirmSaveWorkout = () => {
    const sessionData: Omit<WorkoutSession, 'id'> = {
      date: new Date().toISOString(),
      duration: elapsedSeconds,
      exercises: activeExercises,
      notes: notes.trim() ? notes.trim() : undefined
    };

    onSaveWorkout(sessionData);
    setShowSummaryModal(false);
    onNavigate('history');
  };

  // Chia sẻ buổi tập (Web Share API hoặc Copy)
  const handleShareWorkout = async () => {
    const summaryText = `🏋️ Tôi vừa hoàn thành buổi tập với GymWork!\n⏱️ Thời gian: ${formatTimer(elapsedSeconds)}\n📊 Khối lượng: ${stats.volume} kg\n🔥 Calo: ${stats.calories} kcal\n💪 Tổng hiệp: ${stats.completedSets} hiệp\nĐạt mục tiêu mỗi ngày! 🚀`;
    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({
          title: 'Kết quả buổi tập GymWork',
          text: summaryText
        });
      } catch {
        // người dùng huỷ hoặc không hỗ trợ
      }
    } else {
      await navigator.clipboard.writeText(summaryText);
      alert('Đã sao chép tóm tắt buổi tập vào bộ nhớ tạm! Bạn có thể dán để chia sẻ.');
    }
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

  // Danh mục lọc trong modal chọn bài tập
  const categories = ['Tất cả', '★ Yêu thích', 'Thể Trọng', 'Ngực', 'Lưng', 'Chân', 'Vai', 'Tay'];
  const equipmentFilters = ['Tất cả', 'Tạ đòn', 'Tạ đơn', 'Thể trọng'];

  const filteredExercises = INITIAL_EXERCISES.filter((ex) => {
    let matchCat = true;
    if (selectedCategory === '★ Yêu thích') {
      matchCat = favoriteExerciseIds.includes(ex.id);
    } else if (selectedCategory !== 'Tất cả') {
      matchCat = ex.category === selectedCategory;
    }

    let matchEq = true;
    if (selectedEquipment === 'Thể trọng') {
      matchEq = !!ex.isBodyweight;
    } else if (selectedEquipment === 'Tạ đòn') {
      matchEq = ex.name.toLowerCase().includes('press') || ex.name.toLowerCase().includes('deadlift') || ex.name.toLowerCase().includes('squat');
    } else if (selectedEquipment === 'Tạ đơn') {
      matchEq = ex.name.toLowerCase().includes('dumbbell') || ex.name.toLowerCase().includes('curl') || ex.name.toLowerCase().includes('raise');
    }

    const matchSearch =
      ex.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ex.muscleGroups.some((mg) => mg.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchCat && matchEq && matchSearch;
  }).sort((a, b) => {
    const aFav = favoriteExerciseIds.includes(a.id);
    const bFav = favoriteExerciseIds.includes(b.id);
    if (aFav && !bFav) return -1;
    if (!aFav && bFav) return 1;
    return 0;
  });

  const activeActionExercise = activeExercises.find((e) => e.exerciseId === actionSheetExerciseId);

  return (
    <div className={styles.container}>
      {/* 1. Header trên cùng: Tiêu đề & Nút Xong / Bắt đầu (Screenshot 5) */}
      <div className={styles.appHeader}>
        <button
          type="button"
          className={styles.headerBackBtn}
          onClick={() => onNavigate('home')}
          title="Thu nhỏ về trang chủ"
        >
          ⌄
        </button>
        <h2 className={styles.headerTitle}>Tập luyện</h2>
        {!activeStartTime ? (
          <button
            type="button"
            className={styles.headerStartBtn}
            onClick={handleStartWorkout}
          >
            ▶ Bắt đầu
          </button>
        ) : (
          <button
            type="button"
            className={styles.headerFinishBtn}
            onClick={handleOpenFinishModal}
          >
            Xong
          </button>
        )}
      </div>

      {/* 2. Top Stats Bar: 4 chỉ số GymWork (Thời gian, Volume, Calo, Hiệp) */}
      <div className={styles.statsCard}>
        <div className={styles.statColumn}>
          <div className={styles.statValue}>
            {activeStartTime ? formatTimer(elapsedSeconds) : '00:00'}
          </div>
          <div className={styles.statLabel}>Thời gian tập</div>
        </div>

        <div className={styles.statDivider} />

        <div className={styles.statColumn}>
          <div className={styles.statValue}>
            {stats.volume.toLocaleString('vi-VN')} <span className={styles.statUnit}>kg</span>
          </div>
          <div className={styles.statLabel}>Volume</div>
        </div>

        <div className={styles.statDivider} />

        <div className={styles.statColumn}>
          <div className={styles.statValue}>
            {stats.calories} <span className={styles.statUnit}>kcal</span>
          </div>
          <div className={styles.statLabel}>Calo</div>
        </div>

        <div className={styles.statDivider} />

        <div className={styles.statColumn}>
          <div className={styles.statValue}>
            {stats.completedSets}<span className={styles.statTotal}>/{stats.totalSets}</span>
          </div>
          <div className={styles.statLabel}>Hiệp</div>
        </div>
      </div>

      {/* Danh sách các bài tập đang tập */}
      {activeExercises.length === 0 && (
        <div className={styles.emptyState}>
          <div className={styles.emptyIcon}>🏋️‍♂️</div>
          <h3 className={styles.emptyTitle}>Chưa có bài tập nào</h3>
          <p className={styles.emptyDesc}>Bấm nút "Thêm bài tập" bên dưới để bắt đầu ghi nhận các hiệp tập hôm nay.</p>
        </div>
      )}

      {activeExercises.map((exercise) => {
        const isBw = isExerciseBodyweight(exercise.exerciseId);
        const isDuration = isExerciseDurationBased(exercise.exerciseId);
        const exDetail = INITIAL_EXERCISES.find((e) => e.id === exercise.exerciseId);
        const category = exDetail?.category || 'Ngực';
        const hasNote = !!exerciseNotes[exercise.exerciseId];

        return (
          <div key={exercise.exerciseId} className={styles.exerciseBlock}>
            {/* Header bài tập: Avatar thumbnail, Tên, nút Swap ⇄ & Menu ⋮ */}
            <div className={styles.exerciseHeader}>
              <div className={styles.exerciseInfoRow}>
                <div className={styles.muscleThumb}>
                  <span>{getCategoryIcon(category)}</span>
                </div>
                <div>
                  <h3 className={styles.exerciseTitle}>{exercise.exerciseName}</h3>
                  <span className={styles.exerciseSubtitle}>
                    {category} • {isDuration ? 'Tính theo giây' : isBw ? 'Thể trọng' : 'Tạ'}
                  </span>
                </div>
              </div>

              <div className={styles.exerciseActionsRight}>
                <button
                  type="button"
                  className={styles.iconBtn}
                  onClick={() => {
                    setSwappingExerciseId(exercise.exerciseId);
                    setIsExercisePickerOpen(true);
                  }}
                  title="Thay thế bài tập khác"
                >
                  ⇄
                </button>
                <button
                  type="button"
                  className={styles.iconBtn}
                  onClick={() => setActionSheetExerciseId(exercise.exerciseId)}
                  title="Tùy chọn bài tập"
                >
                  ⋮
                </button>
              </div>
            </div>

            {/* Ghi chú riêng cho bài tập (nếu có) */}
            {editingNoteId === exercise.exerciseId ? (
              <div className={styles.exerciseNoteEditBox}>
                <input
                  type="text"
                  className={styles.exerciseNoteInput}
                  placeholder="Ghi chú kỹ thuật, cảm nhận..."
                  value={exerciseNotes[exercise.exerciseId] || ''}
                  onChange={(e) =>
                    setExerciseNotes({ ...exerciseNotes, [exercise.exerciseId]: e.target.value })
                  }
                  autoFocus
                />
                <button
                  type="button"
                  className={styles.saveNoteBtn}
                  onClick={() => setEditingNoteId(null)}
                >
                  Lưu
                </button>
              </div>
            ) : hasNote ? (
              <div
                className={styles.exerciseNoteDisplay}
                onClick={() => setEditingNoteId(exercise.exerciseId)}
              >
                📝 {exerciseNotes[exercise.exerciseId]}
              </div>
            ) : null}

            {/* Bảng các hiệp tập: HIỆP | TRƯỚC ĐÓ | KG | SỐ LẦN/GIÂY | ✓ */}
            <div className={styles.setTableHeader}>
              <span className={styles.textCenter}>HIỆP</span>
              <span className={styles.textCenter}>TRƯỚC ĐÓ</span>
              <span className={styles.textCenter}>{isBw ? 'TẠ THÊM' : 'KG'}</span>
              <span className={styles.textCenter}>{isDuration ? 'GIÂY' : 'SỐ LẦN'}</span>
              <span className={styles.textCenter}>✓</span>
              <span />
            </div>

            <div className={styles.setsList}>
              {exercise.sets.map((set, setIdx) => {
                const prevRecord = getPreviousPerformance(exercise.exerciseId, setIdx);
                return (
                  <SetRow
                    key={set.id}
                    index={setIdx}
                    set={set}
                    previousPerformance={prevRecord}
                    isBodyweight={isBw}
                    isDurationBased={isDuration}
                    onUpdate={(updated) => handleUpdateSet(exercise.exerciseId, updated)}
                    onDelete={(id) => handleDeleteSet(exercise.exerciseId, id)}
                    onCompleteSet={handleCompleteSet}
                  />
                );
              })}
            </div>

            {/* Thanh điều khiển hiệp: [ - ] Set [ + ] GymWork style */}
            <div className={styles.setControlsRow}>
              <button
                type="button"
                className={styles.setControlBtn}
                onClick={() => handleRemoveLastSet(exercise.exerciseId)}
                disabled={exercise.sets.length <= 1}
                title="Bớt 1 hiệp"
              >
                - Hiệp
              </button>
              <span className={styles.setCountLabel}>{exercise.sets.length} Hiệp</span>
              <button
                type="button"
                className={`${styles.setControlBtn} ${styles.setControlBtnAdd}`}
                onClick={() => handleAddSet(exercise.exerciseId)}
                title="Thêm 1 hiệp mới"
              >
                + Thêm hiệp
              </button>
            </div>
          </div>
        );
      })}

      {/* Nút thêm bài tập chính */}
      <button
        type="button"
        className={styles.addExerciseMainBtn}
        onClick={() => {
          setSwappingExerciseId(null);
          setIsExercisePickerOpen(true);
        }}
      >
        <span className={styles.addPlusIcon}>+</span>
        <span>Thêm bài tập</span>
      </button>

      {/* Ghi chú chung cho buổi tập */}
      <div className={styles.notesCard}>
        <textarea
          className={styles.notesInput}
          placeholder="Ghi chú buổi tập hôm nay (thể lực, cảm nhận, mức tạ...)..."
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

      {/* Floating Rest Timer bar (Screenshot 5) */}
      <RestTimer
        isOpen={isRestTimerOpen}
        initialSeconds={restTimerSeconds}
        onClose={() => setIsRestTimerOpen(false)}
        onSelectDuration={(secs) => setRestTimerSeconds(secs)}
      />

      {/* Bottom Sheet Tùy chọn bài tập (Screenshot 3) */}
      {actionSheetExerciseId && activeActionExercise && (
        <div
          className={styles.modalBackdrop}
          onClick={() => setActionSheetExerciseId(null)}
        >
          <div
            className={styles.bottomSheetModal}
            onClick={(e) => e.stopPropagation()}
          >
            <div className={styles.dragHandle} />
            <div className={styles.sheetHeader}>
              <h3 className={styles.sheetTitle}>{activeActionExercise.exerciseName}</h3>
              <button
                type="button"
                className={styles.sheetCloseBtn}
                onClick={() => setActionSheetExerciseId(null)}
              >
                ✕
              </button>
            </div>

            <div className={styles.sheetMenuList}>
              <button
                type="button"
                className={styles.sheetMenuItem}
                onClick={() => {
                  setRestTimerSeconds(90);
                  setIsRestTimerOpen(true);
                  setActionSheetExerciseId(null);
                }}
              >
                <span className={styles.sheetMenuIcon}>⏱️</span>
                <div className={styles.sheetMenuText}>
                  <div className={styles.sheetMenuTitle}>Hẹn giờ nghỉ</div>
                  <div className={styles.sheetMenuSub}>Cài đặt thời gian nghỉ giữa các hiệp</div>
                </div>
              </button>

              <button
                type="button"
                className={styles.sheetMenuItem}
                onClick={() => {
                  setEditingNoteId(actionSheetExerciseId);
                  setActionSheetExerciseId(null);
                }}
              >
                <span className={styles.sheetMenuIcon}>📝</span>
                <div className={styles.sheetMenuText}>
                  <div className={styles.sheetMenuTitle}>Ghi chú bài tập</div>
                  <div className={styles.sheetMenuSub}>Lưu lưu ý kỹ thuật hoặc cảm nhận</div>
                </div>
              </button>

              <button
                type="button"
                className={styles.sheetMenuItem}
                onClick={() => {
                  setSwappingExerciseId(actionSheetExerciseId);
                  setActionSheetExerciseId(null);
                  setIsExercisePickerOpen(true);
                }}
              >
                <span className={styles.sheetMenuIcon}>⇄</span>
                <div className={styles.sheetMenuText}>
                  <div className={styles.sheetMenuTitle}>Thay thế bài tập</div>
                  <div className={styles.sheetMenuSub}>Đổi bài tập khác mà giữ nguyên số hiệp</div>
                </div>
              </button>

              <button
                type="button"
                className={styles.sheetMenuItem}
                onClick={() => handleMoveExercise(actionSheetExerciseId, 'up')}
              >
                <span className={styles.sheetMenuIcon}>⬆️</span>
                <div className={styles.sheetMenuText}>
                  <div className={styles.sheetMenuTitle}>Di chuyển lên trên</div>
                  <div className={styles.sheetMenuSub}>Thay đổi thứ tự bài tập</div>
                </div>
              </button>

              <button
                type="button"
                className={styles.sheetMenuItem}
                onClick={() => handleMoveExercise(actionSheetExerciseId, 'down')}
              >
                <span className={styles.sheetMenuIcon}>⬇️</span>
                <div className={styles.sheetMenuText}>
                  <div className={styles.sheetMenuTitle}>Di chuyển xuống dưới</div>
                  <div className={styles.sheetMenuSub}>Thay đổi thứ tự bài tập</div>
                </div>
              </button>

              <button
                type="button"
                className={`${styles.sheetMenuItem} ${styles.sheetMenuDanger}`}
                onClick={() => handleRemoveExercise(actionSheetExerciseId)}
              >
                <span className={styles.sheetMenuIcon}>🗑️</span>
                <div className={styles.sheetMenuText}>
                  <div className={styles.sheetMenuTitle}>Xóa bài tập khỏi buổi tập</div>
                  <div className={styles.sheetMenuSub}>Gỡ bài tập và toàn bộ hiệp tập này</div>
                </div>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Chọn bài tập (Screenshot 2: Clean Sheet with pills & thumbnails) */}
      {isExercisePickerOpen && (
        <div
          className={styles.modalBackdrop}
          onClick={() => {
            setIsExercisePickerOpen(false);
            setSwappingExerciseId(null);
          }}
        >
          <div
            className={styles.pickerModalSheet}
            onClick={(e) => e.stopPropagation()}
          >
            <div className={styles.dragHandle} />
            <div className={styles.pickerHeader}>
              <h3 className={styles.pickerTitle}>
                {swappingExerciseId ? 'Chọn bài tập thay thế' : 'Chọn bài tập'}
              </h3>
              <button
                type="button"
                className={styles.sheetCloseBtn}
                onClick={() => {
                  setIsExercisePickerOpen(false);
                  setSwappingExerciseId(null);
                }}
              >
                ✕
              </button>
            </div>

            {/* Ô tìm kiếm */}
            <div className={styles.searchBox}>
              <span className={styles.searchIcon}>🔍</span>
              <input
                type="text"
                className={styles.searchInput}
                placeholder="Tìm kiếm bài tập..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                autoFocus
              />
            </div>

            {/* Pill phân loại nhóm cơ */}
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

            {/* Pill lọc theo dụng cụ */}
            <div className={styles.equipmentFilterRow}>
              <span className={styles.filterPrefix}>Dụng cụ:</span>
              {equipmentFilters.map((eq) => (
                <button
                  key={eq}
                  type="button"
                  className={`${styles.subPill} ${selectedEquipment === eq ? styles.subPillActive : ''}`}
                  onClick={() => setSelectedEquipment(eq)}
                >
                  {eq}
                </button>
              ))}
            </div>

            {/* Danh sách bài tập */}
            <div className={styles.exerciseSelectList}>
              {filteredExercises.map((ex) => {
                const isSelected = activeExercises.some((e) => e.exerciseId === ex.id);
                return (
                  <div
                    key={ex.id}
                    className={styles.pickerItem}
                    onClick={() => handleSelectExercise(ex)}
                  >
                    <div className={styles.pickerItemLeft}>
                      <div className={styles.pickerThumb}>
                        <span>{getCategoryIcon(ex.category)}</span>
                      </div>
                      <div>
                        <div className={styles.pickerItemName}>{ex.name}</div>
                        <div className={styles.pickerItemSub}>
                          {ex.category} • {ex.muscleGroups.join(', ')}
                        </div>
                      </div>
                    </div>

                    <div className={styles.pickerItemRight}>
                      {favoriteExerciseIds.includes(ex.id) && (
                        <span className={styles.favBadge}>★</span>
                      )}
                      {isSelected && (
                        <span className={styles.chosenBadge}>Đã chọn ✓</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Modal Tổng kết buổi tập (Screenshot 1: Workout Summary Card) */}
      {showSummaryModal && summaryData && (
        <div className={styles.modalBackdrop}>
          <div className={styles.summaryModalCard} onClick={(e) => e.stopPropagation()}>
            <div className={styles.summaryHeader}>
              <div className={styles.summaryTrophy}>🎉</div>
              <h2 className={styles.summaryTitle}>Tuyệt vời! Hoàn thành buổi tập</h2>
              <p className={styles.summarySub}>Bạn đã hoàn thành xuất sắc các bài tập hôm nay!</p>
            </div>

            <div className={styles.summaryStatsGrid}>
              <div className={styles.summaryStatBox}>
                <span className={styles.summaryStatIcon}>⏱️</span>
                <span className={styles.summaryStatVal}>{formatTimer(summaryData.duration)}</span>
                <span className={styles.summaryStatLabel}>Thời gian</span>
              </div>

              <div className={styles.summaryStatBox}>
                <span className={styles.summaryStatIcon}>🏋️</span>
                <span className={styles.summaryStatVal}>{summaryData.volume.toLocaleString('vi-VN')} kg</span>
                <span className={styles.summaryStatLabel}>Volume</span>
              </div>

              <div className={styles.summaryStatBox}>
                <span className={styles.summaryStatIcon}>🔥</span>
                <span className={styles.summaryStatVal}>{summaryData.calories} kcal</span>
                <span className={styles.summaryStatLabel}>Calo</span>
              </div>

              <div className={styles.summaryStatBox}>
                <span className={styles.summaryStatIcon}>💪</span>
                <span className={styles.summaryStatVal}>{summaryData.totalSets} hiệp</span>
                <span className={styles.summaryStatLabel}>Hiệp hoàn thành</span>
              </div>
            </div>

            <div className={styles.summaryExerciseList}>
              <div className={styles.summaryListTitle}>Chi tiết bài tập ({summaryData.exercises.length})</div>
              {summaryData.exercises.map((ex) => {
                const comp = ex.sets.filter((s) => s.completed).length;
                return (
                  <div key={ex.exerciseId} className={styles.summaryExerciseRow}>
                    <span className={styles.summaryExName}>{ex.exerciseName}</span>
                    <span className={styles.summaryExSets}>{comp}/{ex.sets.length} hiệp</span>
                  </div>
                );
              })}
            </div>

            <div className={styles.summaryActionButtons}>
              <button
                type="button"
                className={styles.summarySaveBtn}
                onClick={handleConfirmSaveWorkout}
              >
                Lưu & Xem lịch sử
              </button>

              <button
                type="button"
                className={styles.summaryShareBtn}
                onClick={handleShareWorkout}
              >
                Chia sẻ thành tích 📤
              </button>

              <button
                type="button"
                className={styles.summaryContinueBtn}
                onClick={() => setShowSummaryModal(false)}
              >
                Tiếp tục tập luyện
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
