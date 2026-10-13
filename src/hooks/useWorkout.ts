import { useLocalStorage } from './useLocalStorage';
import { WorkoutSession, WorkoutPlan, WorkoutExercise, BodyWeightEntry } from '../types';

// Dữ liệu mẫu ban đầu để người dùng có biểu đồ và lịch sử trực quan ngay lần đầu mở ứng dụng
const SAMPLE_WORKOUTS: WorkoutSession[] = [
  {
    id: 'sample-workout-1',
    date: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
    duration: 3120, // 52 phút
    notes: 'Buổi tập ngực đầu tuần, cảm giác căng cơ rất tốt.',
    exercises: [
      {
        exerciseId: 'chest-bench-press',
        exerciseName: 'Bench Press',
        sets: [
          { id: 's1', reps: 10, weight: 60, completed: true, restTime: 60 },
          { id: 's2', reps: 8, weight: 70, completed: true, restTime: 90 },
          { id: 's3', reps: 6, weight: 80, completed: true, restTime: 90 }
        ]
      },
      {
        exerciseId: 'chest-incline-dumbbell-press',
        exerciseName: 'Incline Dumbbell Press',
        sets: [
          { id: 's4', reps: 10, weight: 22, completed: true, restTime: 60 },
          { id: 's5', reps: 8, weight: 24, completed: true, restTime: 60 }
        ]
      }
    ]
  },
  {
    id: 'sample-workout-2',
    date: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
    duration: 2700, // 45 phút
    notes: 'Buổi tập lưng xô, Deadlift đạt PR mới.',
    exercises: [
      {
        exerciseId: 'back-deadlift',
        exerciseName: 'Deadlift',
        sets: [
          { id: 's6', reps: 8, weight: 90, completed: true, restTime: 120 },
          { id: 's7', reps: 6, weight: 110, completed: true, restTime: 120 },
          { id: 's8', reps: 4, weight: 120, completed: true, restTime: 150 }
        ]
      },
      {
        exerciseId: 'back-lat-pulldown',
        exerciseName: 'Lat Pulldown',
        sets: [
          { id: 's9', reps: 12, weight: 50, completed: true, restTime: 60 },
          { id: 's10', reps: 10, weight: 55, completed: true, restTime: 60 }
        ]
      }
    ]
  },
  {
    id: 'sample-workout-3',
    date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    duration: 3600, // 60 phút
    notes: 'Leg day bùng nổ, squat sâu.',
    exercises: [
      {
        exerciseId: 'leg-squat',
        exerciseName: 'Squat',
        sets: [
          { id: 's11', reps: 10, weight: 80, completed: true, restTime: 90 },
          { id: 's12', reps: 8, weight: 95, completed: true, restTime: 90 },
          { id: 's13', reps: 6, weight: 105, completed: true, restTime: 120 }
        ]
      },
      {
        exerciseId: 'leg-press',
        exerciseName: 'Leg Press',
        sets: [
          { id: 's14', reps: 12, weight: 160, completed: true, restTime: 90 },
          { id: 's15', reps: 10, weight: 180, completed: true, restTime: 90 }
        ]
      }
    ]
  },
  {
    id: 'sample-workout-4',
    date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    duration: 2880, // 48 phút
    notes: 'Bench press lên thêm 2.5kg!',
    exercises: [
      {
        exerciseId: 'chest-bench-press',
        exerciseName: 'Bench Press',
        sets: [
          { id: 's16', reps: 10, weight: 65, completed: true, restTime: 60 },
          { id: 's17', reps: 8, weight: 75, completed: true, restTime: 90 },
          { id: 's18', reps: 5, weight: 82.5, completed: true, restTime: 120 }
        ]
      },
      {
        exerciseId: 'shoulder-press',
        exerciseName: 'Shoulder Press',
        sets: [
          { id: 's19', reps: 10, weight: 40, completed: true, restTime: 60 },
          { id: 's20', reps: 8, weight: 45, completed: true, restTime: 60 }
        ]
      }
    ]
  }
];

// Danh sách kế hoạch tập luyện mẫu
const SAMPLE_PLANS: WorkoutPlan[] = [
  {
    id: 'plan-push-pull-legs',
    name: 'Giáo án Push - Pull - Legs',
    days: [
      {
        dayName: 'Ngày 1: Push (Ngực, Vai, Tay sau)',
        exercises: ['chest-bench-press', 'chest-incline-dumbbell-press', 'shoulder-press', 'shoulder-lateral-raise', 'arm-tricep-pushdown']
      },
      {
        dayName: 'Ngày 2: Pull (Lưng, Tay trước)',
        exercises: ['back-deadlift', 'back-pull-up', 'back-lat-pulldown', 'back-cable-row', 'arm-bicep-curl']
      },
      {
        dayName: 'Ngày 3: Legs (Chân, Bắp chuối)',
        exercises: ['leg-squat', 'leg-press', 'leg-romanian-deadlift', 'leg-curl', 'leg-calf-raise']
      }
    ]
  },
  {
    id: 'plan-upper-lower',
    name: 'Giáo án Upper - Lower',
    days: [
      {
        dayName: 'Upper Body (Thân trên)',
        exercises: ['chest-bench-press', 'back-cable-row', 'shoulder-press', 'back-lat-pulldown', 'arm-bicep-curl']
      },
      {
        dayName: 'Lower Body (Thân dưới)',
        exercises: ['leg-squat', 'leg-romanian-deadlift', 'leg-press', 'leg-calf-raise']
      }
    ]
  }
];

export function useWorkout() {
  const [workouts, setWorkouts] = useLocalStorage<WorkoutSession[]>('fittrack_workouts', SAMPLE_WORKOUTS);
  const [plans, setPlans] = useLocalStorage<WorkoutPlan[]>('fittrack_plans', SAMPLE_PLANS);
  const [activeExercises, setActiveExercises] = useLocalStorage<WorkoutExercise[]>('fittrack_active_exercises', []);
  const [activeStartTime, setActiveStartTime] = useLocalStorage<number | null>('fittrack_active_start_time', null);
  // Theo dõi cân nặng cơ thể
  const [bodyWeightLog, setBodyWeightLog] = useLocalStorage<BodyWeightEntry[]>('fittrack_bodyweight', []);
  // Danh sách ID các bài tập yêu thích
  const [favoriteExerciseIds, setFavoriteExerciseIds] = useLocalStorage<string[]>('fittrack_favorites', []);

  // Bật/tắt trạng thái yêu thích của một bài tập
  const toggleFavoriteExercise = (exerciseId: string) => {
    setFavoriteExerciseIds((prev) =>
      prev.includes(exerciseId)
        ? prev.filter((id) => id !== exerciseId)
        : [...prev, exerciseId]
    );
  };

  // Thêm buổi tập mới vào lịch sử
  const saveWorkout = (session: Omit<WorkoutSession, 'id'>) => {
    const newSession: WorkoutSession = {
      ...session,
      id: 'workout-' + Date.now()
    };
    setWorkouts((prev) => [newSession, ...prev]);
    // Reset active workout
    setActiveExercises([]);
    setActiveStartTime(null);
    return newSession;
  };

  // Xóa một buổi tập khỏi lịch sử
  const deleteWorkout = (id: string) => {
    setWorkouts((prev) => prev.filter((w) => w.id !== id));
  };

  // Thêm kế hoạch tập luyện mới
  const savePlan = (plan: WorkoutPlan) => {
    setPlans((prev) => {
      const exists = prev.some((p) => p.id === plan.id);
      if (exists) {
        return prev.map((p) => (p.id === plan.id ? plan : p));
      }
      return [...prev, plan];
    });
  };

  // Xóa kế hoạch
  const deletePlan = (id: string) => {
    setPlans((prev) => prev.filter((p) => p.id !== id));
  };

  // Lưu bản ghi cân nặng mới (hỗ trợ ngày tùy chọn)
  const saveBodyWeight = (weight: number, note?: string, date?: string) => {
    let entryDate = new Date().toISOString();
    if (date) {
      const d = new Date(date);
      if (!isNaN(d.getTime())) {
        entryDate = d.toISOString();
      }
    }
    const entry: BodyWeightEntry = {
      id: 'bw-' + Date.now(),
      date: entryDate,
      weight,
      note
    };
    setBodyWeightLog((prev) => [entry, ...prev]);
    return entry;
  };

  // Xóa bản ghi cân nặng
  const deleteBodyWeight = (id: string) => {
    setBodyWeightLog((prev) => prev.filter((e) => e.id !== id));
  };

  // Lấy bản ghi cân nặng gần nhất
  const getLatestBodyWeight = (): BodyWeightEntry | null => {
    return bodyWeightLog.length > 0 ? bodyWeightLog[0] : null;
  };

  // Tính tổng volume của một buổi tập
  // - Bài tạ: weight × reps (kg)
  // - Bài thể trọng: chỉ tính tổng reps (trả về reps, không phải kg)
  const calculateSessionVolume = (session: WorkoutSession): number => {
    let totalKg = 0;
    session.exercises.forEach((ex) => {
      ex.sets.forEach((set) => {
        if (set.completed && !set.isBodyweight && set.weight > 0) {
          totalKg += set.weight * set.reps;
        }
      });
    });
    return totalKg;
  };

  // Tổng số reps của bài thể trọng trong một buổi tập
  const calculateSessionBodyweightReps = (session: WorkoutSession): number => {
    let totalReps = 0;
    session.exercises.forEach((ex) => {
      ex.sets.forEach((set) => {
        if (set.completed && (set.isBodyweight || set.weight === 0)) {
          totalReps += set.reps;
        }
      });
    });
    return totalReps;
  };

  // Kiểm tra buổi tập có phải hoàn toàn thể trọng không
  const isBodyweightSession = (session: WorkoutSession): boolean => {
    return session.exercises.every((ex) =>
      ex.sets.every((set) => set.isBodyweight || set.weight === 0)
    );
  };

  // Tính số buổi tập trong tuần hiện tại
  const getWorkoutsThisWeek = (): WorkoutSession[] => {
    const now = new Date();
    const dayOfWeek = (now.getDay() + 6) % 7; // 0 = Thứ 2, 6 = CN
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - dayOfWeek);
    startOfWeek.setHours(0, 0, 0, 0);

    return workouts.filter((w) => new Date(w.date) >= startOfWeek);
  };

  // Tính tổng volume tạ trong tuần (kg)
  const getWeeklyVolume = (): number => {
    const thisWeek = getWorkoutsThisWeek();
    return thisWeek.reduce((sum, w) => sum + calculateSessionVolume(w), 0);
  };

  // Tổng reps thể trọng trong tuần
  const getWeeklyBodyweightReps = (): number => {
    const thisWeek = getWorkoutsThisWeek();
    return thisWeek.reduce((sum, w) => sum + calculateSessionBodyweightReps(w), 0);
  };

  // Tính chuỗi ngày tập liên tiếp (Streak)
  const getStreakCount = (): number => {
    if (workouts.length === 0) return 0;

    // Lấy danh sách các ngày duy nhất (YYYY-MM-DD) đã tập, sắp xếp giảm dần
    const uniqueDays = Array.from(
      new Set(
        workouts.map((w) => {
          const d = new Date(w.date);
          return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
        })
      )
    ).sort().reverse();

    if (uniqueDays.length === 0) return 0;

    const today = new Date();
    const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);
    const yesterdayStr = `${yesterday.getFullYear()}-${String(yesterday.getMonth() + 1).padStart(2, '0')}-${String(yesterday.getDate()).padStart(2, '0')}`;

    // Nếu ngày tập gần nhất không phải hôm nay hoặc hôm qua thì chuỗi = 0
    if (uniqueDays[0] !== todayStr && uniqueDays[0] !== yesterdayStr) {
      return 0;
    }

    let streak = 0;
    let checkDate = new Date(uniqueDays[0]);

    for (let i = 0; i < uniqueDays.length; i++) {
      const dateStr = uniqueDays[i];
      const targetStr = `${checkDate.getFullYear()}-${String(checkDate.getMonth() + 1).padStart(2, '0')}-${String(checkDate.getDate()).padStart(2, '0')}`;
      if (dateStr === targetStr) {
        streak++;
        checkDate.setDate(checkDate.getDate() - 1);
      } else {
        break;
      }
    }

    return streak;
  };

  return {
    workouts,
    plans,
    activeExercises,
    setActiveExercises,
    activeStartTime,
    setActiveStartTime,
    bodyWeightLog,
    saveWorkout,
    deleteWorkout,
    savePlan,
    deletePlan,
    saveBodyWeight,
    deleteBodyWeight,
    getLatestBodyWeight,
    calculateSessionVolume,
    calculateSessionBodyweightReps,
    isBodyweightSession,
    getWorkoutsThisWeek,
    getWeeklyVolume,
    getWeeklyBodyweightReps,
    getStreakCount,
    favoriteExerciseIds,
    toggleFavoriteExercise
  };
}

