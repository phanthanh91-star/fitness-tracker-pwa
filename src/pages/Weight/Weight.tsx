import React, { useState, useMemo } from 'react';
import styles from './Weight.module.css';
import { BodyWeightEntry } from '../../types';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid
} from 'recharts';

interface WeightProps {
  bodyWeightLog: BodyWeightEntry[];
  onSaveBodyWeight: (weight: number, note?: string, date?: string) => void;
  onDeleteBodyWeight: (id: string) => void;
}

export const Weight: React.FC<WeightProps> = ({
  bodyWeightLog,
  onSaveBodyWeight,
  onDeleteBodyWeight
}) => {
  // Sắp xếp lịch sử theo thời gian giảm dần (mới nhất lên đầu)
  const sortedDesc = useMemo(() => {
    return [...bodyWeightLog].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );
  }, [bodyWeightLog]);

  // Cân nặng mới nhất và trước đó
  const latestEntry = sortedDesc.length > 0 ? sortedDesc[0] : null;
  const previousEntry = sortedDesc.length > 1 ? sortedDesc[1] : null;

  const [weightInput, setWeightInput] = useState<string>(() => {
    return latestEntry ? String(latestEntry.weight) : '65';
  });

  const [dateInput, setDateInput] = useState(() => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  });
  const [noteInput, setNoteInput] = useState('');
  const [justSaved, setJustSaved] = useState(false);

  // Chiều cao để tính BMI (lưu vào localStorage)
  const [heightCm, setHeightCm] = useState<number>(() => {
    const saved = localStorage.getItem('fittrack_user_height');
    return saved ? parseFloat(saved) : 170;
  });
  const [isEditingHeight, setIsEditingHeight] = useState(false);
  const [tempHeight, setTempHeight] = useState(String(heightCm));

  const handleSaveHeight = () => {
    const val = parseFloat(tempHeight);
    if (!isNaN(val) && val >= 100 && val <= 250) {
      setHeightCm(val);
      localStorage.setItem('fittrack_user_height', String(val));
    }
    setIsEditingHeight(false);
  };

  // Tính BMI tự động
  const bmiData = useMemo(() => {
    const currentW = latestEntry ? latestEntry.weight : parseFloat(weightInput);
    if (!currentW || !heightCm || heightCm <= 0) return null;

    const heightM = heightCm / 100;
    const bmi = Number((currentW / (heightM * heightM)).toFixed(1));

    let category = 'Cân đối';
    let color = 'var(--success-color)';

    if (bmi < 18.5) {
      category = 'Hơi gầy';
      color = 'var(--info-color)';
    } else if (bmi <= 24.9) {
      category = 'Chuẩn cân đối';
      color = 'var(--success-color)';
    } else if (bmi <= 29.9) {
      category = 'Hơi thừa cân';
      color = 'var(--warning-color)';
    } else {
      category = 'Béo phì';
      color = 'var(--danger-color)';
    }

    return { bmi, category, color };
  }, [latestEntry, weightInput, heightCm]);

  const weightDiff = useMemo(() => {
    if (!latestEntry || !previousEntry) return null;
    return Number((latestEntry.weight - previousEntry.weight).toFixed(1));
  }, [latestEntry, previousEntry]);

  // Mức cao nhất, thấp nhất
  const { minWeight, maxWeight, avgWeight } = useMemo(() => {
    if (bodyWeightLog.length === 0) {
      return { minWeight: 0, maxWeight: 0, avgWeight: 0 };
    }
    const weights = bodyWeightLog.map((e) => e.weight);
    const min = Math.min(...weights);
    const max = Math.max(...weights);
    const avg = Number((weights.reduce((s, w) => s + w, 0) / weights.length).toFixed(1));
    return { minWeight: min, maxWeight: max, avgWeight: avg };
  }, [bodyWeightLog]);

  // Dữ liệu cho biểu đồ (sắp xếp tăng dần theo thời gian)
  const chartData = useMemo(() => {
    const sortedAsc = [...bodyWeightLog].sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );
    return sortedAsc.map((entry) => {
      const d = new Date(entry.date);
      return {
        date: `${d.getDate()}/${d.getMonth() + 1}`,
        fullDate: d.toLocaleDateString('vi-VN'),
        weight: entry.weight,
        note: entry.note
      };
    });
  }, [bodyWeightLog]);

  // Điều chỉnh nhanh số cân (+/-)
  const adjustWeight = (delta: number) => {
    const current = parseFloat(weightInput) || (latestEntry ? latestEntry.weight : 65);
    const next = Number(Math.max(20, Math.min(300, current + delta)).toFixed(1));
    setWeightInput(String(next));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseFloat(weightInput);
    if (isNaN(val) || val <= 20 || val >= 300) return;

    onSaveBodyWeight(val, noteInput.trim() || undefined, dateInput);
    setNoteInput('');
    setJustSaved(true);
    setTimeout(() => setJustSaved(false), 2000);
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

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <h1 className={styles.title}>⚖️ Theo dõi cân nặng</h1>
        <p className={styles.subtitle}>Ghi nhận cân nặng, tính BMI và theo dõi tiến trình giảm/tăng cân</p>
      </div>

      {/* Thẻ tổng quan cân nặng */}
      <div className={styles.summaryCard}>
        <div className={styles.currentWeightRow}>
          <div>
            <div className={styles.currentLabel}>Cân nặng hiện tại</div>
            <div className={styles.currentValue}>
              {latestEntry ? latestEntry.weight : '--'}
              <span className={styles.currentUnit}>kg</span>
            </div>
          </div>

          {weightDiff !== null && (
            <div
              className={`${styles.diffBadge} ${
                weightDiff > 0 ? styles.diffUp : weightDiff < 0 ? styles.diffDown : styles.diffSame
              }`}
            >
              <span>{weightDiff > 0 ? `▲ +${weightDiff}` : weightDiff < 0 ? `▼ ${weightDiff}` : '— 0.0'} kg</span>
            </div>
          )}
        </div>

        {/* Tiện ích tính BMI tự động */}
        {bmiData && (
          <div className={styles.bmiBox}>
            <div className={styles.bmiTop}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span className={styles.bmiLabel}>Chỉ số BMI:</span>
                <span className={styles.bmiScore}>{bmiData.bmi}</span>
                <span
                  className={styles.bmiCategory}
                  style={{ color: bmiData.color, borderColor: bmiData.color }}
                >
                  {bmiData.category}
                </span>
              </div>

              {isEditingHeight ? (
                <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
                  <input
                    type="number"
                    style={{
                      width: '60px',
                      padding: '4px 6px',
                      borderRadius: '6px',
                      background: '#0b0e17',
                      border: '1px solid var(--accent-color)',
                      color: '#fff',
                      fontSize: '12px'
                    }}
                    value={tempHeight}
                    onChange={(e) => setTempHeight(e.target.value)}
                    autoFocus
                  />
                  <button
                    type="button"
                    onClick={handleSaveHeight}
                    style={{
                      background: 'var(--accent-color)',
                      border: 'none',
                      color: '#fff',
                      fontSize: '11px',
                      padding: '4px 8px',
                      borderRadius: '6px',
                      cursor: 'pointer'
                    }}
                  >
                    Lưu
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    setTempHeight(String(heightCm));
                    setIsEditingHeight(true);
                  }}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: 'var(--text-muted)',
                    fontSize: '12px',
                    cursor: 'pointer',
                    textDecoration: 'underline'
                  }}
                >
                  Cao {heightCm} cm ✎
                </button>
              )}
            </div>

            {/* Thanh đo phân loại BMI */}
            <div className={styles.bmiBar}>
              <div className={styles.bmiSegment} style={{ background: 'var(--info-color)', opacity: bmiData.bmi < 18.5 ? 1 : 0.3 }} />
              <div className={styles.bmiSegment} style={{ background: 'var(--success-color)', opacity: bmiData.bmi >= 18.5 && bmiData.bmi <= 24.9 ? 1 : 0.3 }} />
              <div className={styles.bmiSegment} style={{ background: 'var(--warning-color)', opacity: bmiData.bmi >= 25 && bmiData.bmi <= 29.9 ? 1 : 0.3 }} />
              <div className={styles.bmiSegment} style={{ background: 'var(--danger-color)', opacity: bmiData.bmi >= 30 ? 1 : 0.3 }} />
            </div>
          </div>
        )}

        <div className={styles.statsRow}>
          <div className={styles.statItem}>
            <span className={styles.statLabel}>Thấp nhất</span>
            <span className={styles.statVal}>{minWeight > 0 ? `${minWeight} kg` : '--'}</span>
          </div>
          <div className={styles.statItem}>
            <span className={styles.statLabel}>Trung bình</span>
            <span className={styles.statVal}>{avgWeight > 0 ? `${avgWeight} kg` : '--'}</span>
          </div>
          <div className={styles.statItem}>
            <span className={styles.statLabel}>Cao nhất</span>
            <span className={styles.statVal}>{maxWeight > 0 ? `${maxWeight} kg` : '--'}</span>
          </div>
        </div>
      </div>

      {/* Form nhập cân nặng tiện ích với nút bấm nhanh */}
      <form className={styles.formCard} onSubmit={handleSave}>
        <h3 className={styles.formTitle}>
          <span>⚡</span> Ghi nhận cân nặng
        </h3>

        <div className={styles.formGrid}>
          <div className={styles.inputGroup}>
            <label className={styles.label}>Số cân (kg) *</label>
            <input
              type="number"
              step="0.1"
              min="20"
              max="300"
              placeholder="Ví dụ: 68.5"
              className={styles.input}
              value={weightInput}
              onChange={(e) => setWeightInput(e.target.value)}
              required
            />
          </div>

          <div className={styles.inputGroup}>
            <label className={styles.label}>Ngày cân</label>
            <input
              type="date"
              className={styles.input}
              value={dateInput}
              onChange={(e) => setDateInput(e.target.value)}
            />
          </div>
        </div>

        {/* Các nút bấm điều chỉnh nhanh - Siêu tiện lợi trên Mobile */}
        <div className={styles.quickAdjustRow}>
          <button type="button" className={styles.adjustBtn} onClick={() => adjustWeight(-1)}>
            -1.0
          </button>
          <button type="button" className={styles.adjustBtn} onClick={() => adjustWeight(-0.5)}>
            -0.5
          </button>
          <button type="button" className={styles.adjustBtn} onClick={() => adjustWeight(-0.1)}>
            -0.1
          </button>
          <button type="button" className={styles.adjustBtn} onClick={() => adjustWeight(0.1)}>
            +0.1
          </button>
          <button type="button" className={styles.adjustBtn} onClick={() => adjustWeight(0.5)}>
            +0.5
          </button>
          <button type="button" className={styles.adjustBtn} onClick={() => adjustWeight(1)}>
            +1.0
          </button>
        </div>

        <div className={styles.inputGroup}>
          <label className={styles.label}>Ghi chú (tùy chọn)</label>
          <input
            type="text"
            placeholder="Ví dụ: Sau khi ngủ dậy, trước bữa ăn sáng..."
            className={styles.input}
            value={noteInput}
            onChange={(e) => setNoteInput(e.target.value)}
          />
        </div>

        <button
          type="submit"
          className={styles.submitBtn}
          disabled={!weightInput || justSaved}
        >
          {justSaved ? '✓ Đã lưu thành công' : 'Lưu cân nặng ngay'}
        </button>
      </form>

      {/* Biểu đồ AreaChart phát sáng neon */}
      <div className={styles.chartCard}>
        <div className={styles.chartHeader}>
          <h3 className={styles.chartTitle}>Biểu đồ tiến trình cân nặng</h3>
        </div>

        {chartData.length > 0 ? (
          <div className={styles.chartWrapper}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="weightAreaGrad" x1="0" y1="0" x2="0" y2="1">
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
                  domain={['dataMin - 1', 'dataMax + 1']}
                  tickLine={false}
                  unit="kg"
                />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
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
                          <div style={{ color: '#8b949e', fontSize: '11px', fontWeight: 600 }}>{data.fullDate}</div>
                          <div style={{ color: '#ff6b35', fontWeight: 800, fontSize: '18px' }}>
                            {data.weight} kg
                          </div>
                          {data.note && (
                            <div style={{ color: '#c9d1d9', fontSize: '12px', marginTop: '4px' }}>
                              📝 {data.note}
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
                  dataKey="weight"
                  stroke="#FF6B35"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#weightAreaGrad)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className={styles.emptyState}>
            Chưa có đủ dữ liệu để vẽ biểu đồ. Hãy ghi lại cân nặng lần đầu tiên!
          </div>
        )}
      </div>

      {/* Lịch sử ghi nhận */}
      <div className={styles.historyCard}>
        <h3 className={styles.chartTitle}>Lịch sử ghi nhận ({sortedDesc.length})</h3>

        {sortedDesc.length > 0 ? (
          <div className={styles.historyList}>
            {sortedDesc.map((item) => (
              <div key={item.id} className={styles.historyItem}>
                <div className={styles.historyLeft}>
                  <span className={styles.historyDate}>{formatDate(item.date)}</span>
                  {item.note && <span className={styles.historyNote}>{item.note}</span>}
                </div>
                <div className={styles.historyRight}>
                  <span className={styles.historyWeight}>{item.weight} kg</span>
                  <button
                    type="button"
                    className={styles.deleteBtn}
                    onClick={() => onDeleteBodyWeight(item.id)}
                    title="Xóa bản ghi"
                    aria-label="Xóa"
                  >
                    ✕
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className={styles.emptyState}>Chưa có bản ghi cân nặng nào.</div>
        )}
      </div>
    </div>
  );
};
