import React, { useState, useMemo, useEffect } from 'react';
import styles from './Progress.module.css';
import { WorkoutSession } from '../../types';
import { INITIAL_EXERCISES, isExerciseBodyweight } from '../../data/exercises';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid
} from 'recharts';

interface ProgressProps {
  workouts: WorkoutSession[];
  favoriteExerciseIds?: string[];
}

interface ChartDataPoint {
  date: string;
  value: number; // kg hoặc reps tùy chế độ
  reps?: number;
  weight?: number;
}

export const Progress: React.FC<ProgressProps> = ({ workouts, favoriteExerciseIds = [] }) => {
  // Sắp xếp danh sách bài tập: Yêu thích lên trước, sau đó theo tên
  const sortedExercises = useMemo(() => {
    return [...INITIAL_EXERCISES].sort((a, b) => {
      const aFav = favoriteExerciseIds.includes(a.id);
      const bFav = favoriteExerciseIds.includes(b.id);
      if (aFav && !bFav) return -1;
      if (!aFav && bFav) return 1;
      return a.name.localeCompare(b.name, 'vi');
    });
  }, [favoriteExerciseIds]);

  // Lấy bài tập đầu tiên được ưu tiên (ưu tiên bài yêu thích đầu tiên, hoặc bài đã từng tập)
  const initialSelectedId = useMemo(() => {
    if (favoriteExerciseIds.length > 0) {
      return favoriteExerciseIds[0];
    }
    for (const w of workouts) {
      if (w.exercises.length > 0) {
        return w.exercises[0].exerciseId;
      }
    }
    return sortedExercises[0]?.id || INITIAL_EXERCISES[0].id;
  }, [workouts, favoriteExerciseIds, sortedExercises]);

  const [selectedExerciseId, setSelectedExerciseId] = useState<string>(initialSelectedId);

  // Tìm thông tin bài tập được chọn
  const currentExercise = useMemo(() => {
    return (
      INITIAL_EXERCISES.find((e) => e.id === selectedExerciseId) || {
        id: selectedExerciseId,
        name: 'Bài tập',
        category: 'Tất cả',
        isBodyweight: false
      }
    );
  }, [selectedExerciseId]);

  // Kiểm tra bài tập có phải thể trọng không
  const isBodyweight = useMemo(() => {
    return isExerciseBodyweight(currentExercise.id, currentExercise.category);
  }, [currentExercise]);

  // Chế độ theo dõi: 'weight' (Mức tạ kg) hoặc 'reps' (Số lần lặp)
  const [metricMode, setMetricMode] = useState<'weight' | 'reps'>(() => {
    return isExerciseBodyweight(initialSelectedId) ? 'reps' : 'weight';
  });

  // Tự động chuyển chế độ metric phù hợp khi đổi bài tập
  useEffect(() => {
    if (isBodyweight) {
      setMetricMode('reps');
    } else {
      setMetricMode('weight');
    }
  }, [selectedExerciseId, isBodyweight]);

  // Tổng hợp dữ liệu biểu đồ và thống kê
  const {
    chartData,
    maxWeightEver,
    maxRepsEver,
    totalRepsEver,
    totalSessionsWithExercise
  } = useMemo(() => {
    const points: ChartDataPoint[] = [];
    let maxWeight = 0;
    let maxReps = 0;
    let totalReps = 0;
    let totalSessions = 0;

    // Sắp xếp các buổi tập từ cũ nhất đến mới nhất cho biểu đồ
    const sortedWorkouts = [...workouts].sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );

    sortedWorkouts.forEach((w) => {
      const matchEx = w.exercises.find((ex) => ex.exerciseId === selectedExerciseId);
      if (matchEx && matchEx.sets.length > 0) {
        totalSessions++;
        let sessionMaxWeight = 0;
        let sessionMaxReps = 0;
        let bestSetWeight = 0;
        let bestSetReps = 0;

        matchEx.sets.forEach((set) => {
          if (set.completed) {
            totalReps += set.reps;

            // Tính max reps
            if (set.reps > sessionMaxReps) {
              sessionMaxReps = set.reps;
              bestSetWeight = set.weight;
            }

            // Tính max weight
            if (set.weight > sessionMaxWeight) {
              sessionMaxWeight = set.weight;
              bestSetReps = set.reps;
            }
          }
        });

        const d = new Date(w.date);
        const dateLabel = `${d.getDate()}/${d.getMonth() + 1}`;

        if (metricMode === 'reps') {
          if (sessionMaxReps > 0) {
            if (sessionMaxReps > maxReps) {
              maxReps = sessionMaxReps;
            }
            points.push({
              date: dateLabel,
              value: sessionMaxReps,
              weight: bestSetWeight
            });
          }
        } else {
          // metricMode === 'weight'
          if (sessionMaxWeight > 0) {
            if (sessionMaxWeight > maxWeight) {
              maxWeight = sessionMaxWeight;
            }
            points.push({
              date: dateLabel,
              value: sessionMaxWeight,
              reps: bestSetReps
            });
          }
        }
      }
    });

    return {
      chartData: points,
      maxWeightEver: maxWeight,
      maxRepsEver: maxReps,
      totalRepsEver: totalReps,
      totalSessionsWithExercise: totalSessions
    };
  }, [workouts, selectedExerciseId, metricMode]);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>📈 Tiến độ tập luyện</h1>
        <p className={styles.subtitle}>
          Theo dõi kỷ lục mức tạ (PR) hoặc số lần lặp (reps) qua từng buổi tập
        </p>
      </div>

      {/* Bộ chọn bài tập */}
      <div className={styles.selectCard}>
        <label className={styles.selectLabel}>Chọn bài tập theo dõi</label>
        <select
          className={styles.selectInput}
          value={selectedExerciseId}
          onChange={(e) => setSelectedExerciseId(e.target.value)}
        >
          {sortedExercises.map((ex) => {
            const isFav = favoriteExerciseIds.includes(ex.id);
            return (
              <option key={ex.id} value={ex.id}>
                {isFav ? '★ ' : ''}{ex.name} ({ex.category}) {ex.isBodyweight ? '• Thể trọng' : ''}
              </option>
            );
          })}
        </select>
      </div>

      {/* Chuyển đổi chế độ theo dõi (Tạ / Reps) */}
      <div className={styles.metricToggle}>
        <button
          type="button"
          className={`${styles.toggleBtn} ${metricMode === 'reps' ? styles.toggleBtnActive : ''}`}
          onClick={() => setMetricMode('reps')}
        >
          <span>🤸</span>
          <span>Số lần (Reps)</span>
          {isBodyweight && <span style={{ fontSize: '10px', opacity: 0.8 }}>(Khuyên dùng)</span>}
        </button>

        <button
          type="button"
          className={`${styles.toggleBtn} ${metricMode === 'weight' ? styles.toggleBtnActive : ''}`}
          onClick={() => setMetricMode('weight')}
        >
          <span>🏋️</span>
          <span>Mức tạ (Kg)</span>
        </button>
      </div>

      {/* Thẻ thống kê */}
      <div className={styles.statsGrid}>
        {metricMode === 'reps' ? (
          <>
            <div className={styles.statBox}>
              <span className={styles.statBoxLabel}>Kỷ lục Reps (PR)</span>
              <div>
                <span className={styles.statBoxValue}>{maxRepsEver}</span>
                <span className={styles.statBoxUnit}>reps</span>
              </div>
            </div>

            <div className={styles.statBox}>
              <span className={styles.statBoxLabel}>Tổng số Reps tích lũy</span>
              <div>
                <span className={styles.statBoxValue}>{totalRepsEver}</span>
                <span className={styles.statBoxUnit}>reps</span>
              </div>
            </div>
          </>
        ) : (
          <>
            <div className={styles.statBox}>
              <span className={styles.statBoxLabel}>Kỷ lục mức tạ (PR)</span>
              <div>
                <span className={styles.statBoxValue}>{maxWeightEver}</span>
                <span className={styles.statBoxUnit}>kg</span>
              </div>
            </div>

            <div className={styles.statBox}>
              <span className={styles.statBoxLabel}>Tổng số buổi tập</span>
              <div>
                <span className={styles.statBoxValue}>{totalSessionsWithExercise}</span>
                <span className={styles.statBoxUnit}>buổi</span>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Biểu đồ Recharts */}
      <div className={styles.chartCard}>
        <h3 className={styles.chartTitle}>
          {metricMode === 'reps'
            ? `Số lần lặp (Reps) cao nhất qua thời gian (${currentExercise.name})`
            : `Mức tạ (Kg) cao nhất qua thời gian (${currentExercise.name})`}
        </h3>

        {chartData.length > 0 ? (
          <div className={styles.chartWrapper}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="progressAreaGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#FF6B35" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#FF2E74" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" vertical={false} />
                <XAxis
                  dataKey="date"
                  stroke="#8b949e"
                  tick={{ fill: '#8b949e', fontSize: 12, fontWeight: 600 }}
                  tickLine={false}
                />
                <YAxis
                  stroke="#8b949e"
                  tick={{ fill: '#8b949e', fontSize: 12, fontWeight: 600 }}
                  domain={['dataMin - 2', 'dataMax + 2']}
                  tickLine={false}
                  unit={metricMode === 'reps' ? ' reps' : ' kg'}
                />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload as ChartDataPoint;
                      return (
                        <div
                          style={{
                            backgroundColor: '#121726',
                            border: '1px solid #ff6b35',
                            padding: '10px 14px',
                            borderRadius: '12px',
                            boxShadow: '0 8px 20px rgba(0,0,0,0.6)'
                          }}
                        >
                          <div style={{ color: '#8b949e', fontSize: '11px', fontWeight: 600 }}>Ngày: {data.date}</div>
                          <div style={{ color: '#ff6b35', fontWeight: 800, fontSize: '18px' }}>
                            {data.value} {metricMode === 'reps' ? 'reps' : 'kg'}
                          </div>
                          {metricMode === 'reps' && data.weight !== undefined && data.weight > 0 && (
                            <div style={{ color: '#c9d1d9', fontSize: '12px', marginTop: '2px' }}>
                              Tạ thêm: +{data.weight} kg
                            </div>
                          )}
                          {metricMode === 'weight' && data.reps !== undefined && (
                            <div style={{ color: '#c9d1d9', fontSize: '12px', marginTop: '2px' }}>
                              Số lần: {data.reps} reps
                            </div>
                          )}
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke="#FF6B35"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#progressAreaGrad)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className={styles.emptyState}>
            {metricMode === 'reps' ? (
              <>
                Chưa có dữ liệu số lần lặp cho bài <b>{currentExercise.name}</b>. Hãy hoàn thành
                các hiệp tập trong buổi tập để theo dõi tiến độ số reps!
              </>
            ) : (
              <>
                Chưa có dữ liệu nâng tạ cho bài <b>{currentExercise.name}</b>. Hãy ghi lại mức tạ
                trong buổi tập để theo dõi tiến độ, hoặc chuyển sang xem theo <b>Số lần (Reps)</b> ở
                trên!
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
