import React, { useMemo } from 'react';
import styles from './Home.module.css';
import { WorkoutSession, WorkoutPlan, NavTab, BodyWeightEntry } from '../../types';

interface HomeProps {
  workouts: WorkoutSession[];
  plans: WorkoutPlan[];
  onNavigate: (tab: NavTab) => void;
  streakCount: number;
  weeklyWorkoutsCount: number;
  weeklyVolume: number;
  weeklyBodyweightReps: number;
  calculateVolume: (session: WorkoutSession) => number;
  calculateBodyweightReps: (session: WorkoutSession) => number;
  onSelectPlan?: (plan: WorkoutPlan, dayIndex: number) => void;
  bodyWeightLog: BodyWeightEntry[];
}

export const Home: React.FC<HomeProps> = ({
  workouts,
  plans,
  onNavigate,
  streakCount,
  weeklyWorkoutsCount,
  weeklyVolume,
  weeklyBodyweightReps,
  calculateVolume,
  calculateBodyweightReps,
  onSelectPlan,
  bodyWeightLog
}) => {
  // Lời chào theo khung giờ trong ngày
  const greeting = useMemo(() => {
    const hour = new Date().getHours();
    if (hour >= 4 && hour < 12) {
      return 'Chào buổi sáng ☀️';
    } else if (hour >= 12 && hour < 18) {
      return 'Chào buổi chiều 🌤️';
    } else {
      return 'Chào buổi tối 🌙';
    }
  }, []);

  // Buổi tập gần đây nhất
  const recentWorkout = workouts.length > 0 ? workouts[0] : null;

  // Cân nặng gần nhất & trước đó
  const latestBw = bodyWeightLog.length > 0 ? bodyWeightLog[0] : null;
  const prevBw = bodyWeightLog.length > 1 ? bodyWeightLog[1] : null;
  const bwDiff = latestBw && prevBw ? latestBw.weight - prevBw.weight : null;

  // Tính các ngày trong tuần hiện tại (T2 -> CN) và kiểm tra ngày nào đã tập
  const weekDaysData = useMemo(() => {
    const now = new Date();
    const currentDay = (now.getDay() + 6) % 7; // 0 = Thứ 2, 6 = CN
    const monday = new Date(now);
    monday.setDate(now.getDate() - currentDay);
    monday.setHours(0, 0, 0, 0);

    const dayLabels = ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'];
    
    // Tập hợp các ngày đã tập trong tuần
    const workoutDaySet = new Set<number>();
    workouts.forEach((w) => {
      const wDate = new Date(w.date);
      const diffTime = wDate.getTime() - monday.getTime();
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
      if (diffDays >= 0 && diffDays < 7) {
        workoutDaySet.add(diffDays);
      }
    });

    return dayLabels.map((name, index) => {
      const date = new Date(monday);
      date.setDate(monday.getDate() + index);
      const isToday = index === currentDay;
      const isDone = workoutDaySet.has(index);

      return {
        name,
        dateNumber: date.getDate(),
        isToday,
        isDone
      };
    });
  }, [workouts]);

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString('vi-VN', {
      weekday: 'short',
      day: 'numeric',
      month: 'numeric'
    });
  };

  const formatDateShort = (dateStr: string) => {
    const d = new Date(dateStr);
    return `${d.getDate()}/${d.getMonth() + 1}`;
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.round(seconds / 60);
    return `${mins} phút`;
  };

  // Mục tiêu tuần 4 buổi
  const weeklyGoal = 4;
  const goalPercent = Math.min(100, Math.round((weeklyWorkoutsCount / weeklyGoal) * 100));

  return (
    <div className={styles.homeContainer}>
      {/* 1. Header Profile & Streak */}
      <div className={styles.greetingSection}>
        <div className={styles.profileRow}>
          <div className={styles.avatarBadge}>⚡</div>
          <div>
            <h1 className={styles.greetingText}>{greeting}</h1>
            <p className={styles.subGreeting}>Sẵn sàng bứt phá hôm nay! 🔥</p>
          </div>
        </div>

        <div className={styles.streakBadge} title="Chuỗi ngày tập luyện liên tiếp">
          <span className={styles.streakFire}>🔥</span>
          <div>
            <span className={styles.streakNumber}>{streakCount}</span>
            <span className={styles.streakLabel}> ngày</span>
          </div>
        </div>
      </div>

      {/* 2. Lịch tuần 7 ngày (Weekly Tracker - Gamification) */}
      <div className={styles.weekTrackerCard}>
        <div className={styles.weekHeader}>
          <span>Tiến độ tuần này</span>
          <span className={styles.weekGoalText}>
            {weeklyWorkoutsCount}/{weeklyGoal} buổi ({goalPercent}%)
          </span>
        </div>

        <div className={styles.weekDaysRow}>
          {weekDaysData.map((d, idx) => (
            <div
              key={idx}
              className={`${styles.dayPill} ${d.isToday ? styles.dayPillToday : ''}`}
            >
              <span className={styles.dayName}>{d.name}</span>
              <div
                className={`${styles.dayCircle} ${d.isDone ? styles.dayCircleActive : ''}`}
              >
                {d.isDone ? '✓' : d.dateNumber}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 3. Nút Bắt đầu tập ngay - Hero Gradient Button */}
      <button
        type="button"
        className={styles.quickStartBtn}
        onClick={() => onNavigate('active')}
      >
        <div>
          <div className={styles.quickStartTitle}>Bắt đầu buổi tập mới</div>
          <div className={styles.quickStartDesc}>
            Ghi nhận bài tập, số hiệp và bấm giờ nghỉ
          </div>
        </div>
        <div className={styles.quickStartIconWrapper}>⚡</div>
      </button>

      {/* 4. Bento Grid Thống kê */}
      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={styles.statHeader}>
            <span>Số buổi tập tuần</span>
            <div className={styles.statIconBadge}>📅</div>
          </div>
          <div>
            <span className={styles.statValue}>{weeklyWorkoutsCount}</span>
            <span className={styles.statUnit}>buổi</span>
          </div>
          <div className={styles.statProgressBar}>
            <div
              className={styles.statProgressFill}
              style={{ width: `${goalPercent}%` }}
            />
          </div>
        </div>

        {weeklyVolume > 0 ? (
          <div className={styles.statCard}>
            <div className={styles.statHeader}>
              <span>Khối lượng tạ</span>
              <div className={styles.statIconBadge}>🏋️</div>
            </div>
            <div>
              <span className={styles.statValue}>
                {weeklyVolume > 1000
                  ? (weeklyVolume / 1000).toFixed(1)
                  : weeklyVolume.toLocaleString()}
              </span>
              <span className={styles.statUnit}>{weeklyVolume > 1000 ? 'tấn' : 'kg'}</span>
            </div>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px' }}>
              Tổng tạ nâng tuần này
            </div>
          </div>
        ) : (
          <div className={styles.statCard}>
            <div className={styles.statHeader}>
              <span>Số lần Reps</span>
              <div className={styles.statIconBadge}>🤸</div>
            </div>
            <div>
              <span className={styles.statValue}>
                {weeklyBodyweightReps > 0 ? weeklyBodyweightReps.toLocaleString() : '0'}
              </span>
              <span className={styles.statUnit}>reps</span>
            </div>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px' }}>
              Đã tập tuần này
            </div>
          </div>
        )}
      </div>

      {/* 5. Widget Theo dõi Cân nặng (Bấm là chuyển sang tab Cân nặng) */}
      <div className={styles.weightWidget} onClick={() => onNavigate('weight')}>
        <div className={styles.weightLeft}>
          <div className={styles.weightIconCircle}>⚖️</div>
          <div className={styles.weightInfo}>
            <span className={styles.weightLabel}>Cân nặng cơ thể</span>
            {latestBw ? (
              <div>
                <span className={styles.weightNumber}>{latestBw.weight}</span>
                <span className={styles.weightUnit}>kg</span>
                <span style={{ fontSize: '12px', color: 'var(--text-muted)', marginLeft: '8px' }}>
                  ({formatDateShort(latestBw.date)})
                </span>
              </div>
            ) : (
              <span style={{ fontSize: '14px', color: 'var(--text-muted)' }}>Chưa ghi nhận</span>
            )}
          </div>
        </div>

        <div className={styles.weightRight}>
          {bwDiff !== null && (
            <span
              className={
                bwDiff > 0
                  ? styles.weightBadgeUp
                  : bwDiff < 0
                  ? styles.weightBadgeDown
                  : styles.weightBadgeSame
              }
            >
              {bwDiff > 0 ? `▲ +${bwDiff.toFixed(1)}` : bwDiff < 0 ? `▼ ${bwDiff.toFixed(1)}` : '— 0.0'} kg
            </span>
          )}
          <span className={styles.weightLinkText}>Chi tiết & Biểu đồ →</span>
        </div>
      </div>

      {/* 6. Buổi tập gần nhất */}
      <div className={styles.section}>
        <div className={styles.sectionHeader}>
          <span className={styles.sectionTitle}>Buổi tập gần nhất</span>
          {recentWorkout && (
            <button
              type="button"
              className={styles.sectionLink}
              onClick={() => onNavigate('history')}
            >
              Xem tất cả →
            </button>
          )}
        </div>

        {recentWorkout ? (
          <div className={styles.recentCard}>
            <div className={styles.recentTop}>
              <span className={styles.recentDate}>{formatDate(recentWorkout.date)}</span>
              <span className={styles.recentMetaBadge}>
                ⏱️ {formatDuration(recentWorkout.duration)}
                {calculateVolume(recentWorkout) > 0 && ` • 🏋️ ${calculateVolume(recentWorkout).toLocaleString()} kg`}
                {calculateBodyweightReps(recentWorkout) > 0 && ` • 🤸 ${calculateBodyweightReps(recentWorkout)} reps`}
              </span>
            </div>

            <div className={styles.recentExercisesList}>
              {recentWorkout.exercises.map((ex) => (
                <span key={ex.exerciseId} className={styles.exerciseTag}>
                  {ex.exerciseName} • {ex.sets.length} hiệp
                </span>
              ))}
            </div>
          </div>
        ) : (
          <div className={styles.emptyState}>
            Chưa có lịch sử buổi tập nào. Hãy bắt đầu ngay buổi tập đầu tiên!
          </div>
        )}
      </div>

      {/* 7. Giáo án đề xuất */}
      <div className={styles.section}>
        <div className={styles.sectionHeader}>
          <span className={styles.sectionTitle}>Giáo án tập luyện đề xuất</span>
        </div>

        <div className={styles.plansGrid}>
          {plans.map((plan) => (
            <div key={plan.id} className={styles.planCard}>
              <div className={styles.planTop}>
                <div className={styles.planName}>{plan.name}</div>
                <div className={styles.planDays}>{plan.days.length} ngày tập / tuần</div>
              </div>
              <div className={styles.planActions}>
                {plan.days.map((day, idx) => (
                  <button
                    key={idx}
                    type="button"
                    className={styles.planStartBtn}
                    onClick={() => {
                      if (onSelectPlan) {
                        onSelectPlan(plan, idx);
                      }
                      onNavigate('active');
                    }}
                  >
                    Tập {day.dayName.split(':')[0]} →
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
