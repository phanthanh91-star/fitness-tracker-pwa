import React, { useState } from 'react';
import styles from './History.module.css';
import { WorkoutSession } from '../../types';

interface HistoryProps {
  workouts: WorkoutSession[];
  onDeleteWorkout: (id: string) => void;
  calculateVolume: (session: WorkoutSession) => number;
}

export const History: React.FC<HistoryProps> = ({
  workouts,
  onDeleteWorkout,
  calculateVolume
}) => {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const toggleExpand = (id: string) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString('vi-VN', {
      weekday: 'short',
      day: 'numeric',
      month: 'numeric',
      year: 'numeric'
    });
  };

  const formatTime = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleTimeString('vi-VN', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.round(seconds / 60);
    return `${mins} phút`;
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Lịch sử tập luyện</h1>
        <span className={styles.countBadge}>{workouts.length} buổi</span>
      </div>

      {workouts.length === 0 ? (
        <div className={styles.emptyState}>
          <div className={styles.emptyIcon}>📋</div>
          <p>Chưa có buổi tập nào được ghi lại.</p>
          <p style={{ fontSize: '13px', marginTop: '6px' }}>
            Sau khi hoàn thành buổi tập, nhật ký sẽ tự động lưu trữ tại đây.
          </p>
        </div>
      ) : (
        workouts.map((session) => {
          const isExpanded = expandedId === session.id;
          const totalVol = calculateVolume(session);

          return (
            <div
              key={session.id}
              className={styles.workoutCard}
              onClick={() => toggleExpand(session.id)}
            >
              <div className={styles.cardHeader}>
                <div>
                  <div className={styles.workoutDate}>{formatDate(session.date)}</div>
                  <div className={styles.workoutTime}>{formatTime(session.date)}</div>
                </div>

                <div className={styles.metaTags}>
                  <span className={styles.badgeVolume}>{totalVol.toLocaleString()} kg</span>
                  <span className={styles.badgeDuration}>{formatDuration(session.duration)}</span>
                </div>
              </div>

              {/* Tóm tắt danh sách bài tập */}
              <div className={styles.previewExercises}>
                {session.exercises.map((ex) => (
                  <span key={ex.exerciseId} className={styles.previewTag}>
                    {ex.exerciseName} • {ex.sets.length} hiệp
                  </span>
                ))}
              </div>

              {/* Chi tiết mở rộng khi bấm vào thẻ */}
              {isExpanded && (
                <div
                  className={styles.expandedDetails}
                  onClick={(e) => e.stopPropagation()}
                >
                  {session.notes && (
                    <div className={styles.notesBox}>
                      "{session.notes}"
                    </div>
                  )}

                  {session.exercises.map((ex) => (
                    <div key={ex.exerciseId} className={styles.exerciseDetailItem}>
                      <span className={styles.exerciseDetailName}>{ex.exerciseName}</span>
                      <div className={styles.setsGrid}>
                        {ex.sets.map((set, sIdx) => (
                          <div key={set.id} className={styles.setDetailRow}>
                            <span>Hiệp {sIdx + 1}</span>
                            <span>{set.weight} kg × {set.reps} reps</span>
                            <span className={set.completed ? styles.setDetailCompleted : ''}>
                              {set.completed ? 'Hoàn thành ✓' : 'Chưa xong'}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}

                  <div className={styles.cardActions}>
                    <button
                      type="button"
                      className={styles.deleteBtn}
                      onClick={() => {
                        if (window.confirm('Bạn có chắc muốn xóa buổi tập này khỏi lịch sử?')) {
                          onDeleteWorkout(session.id);
                        }
                      }}
                    >
                      Xóa buổi tập này 🗑️
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })
      )}
    </div>
  );
};
