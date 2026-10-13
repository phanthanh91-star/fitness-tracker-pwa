import { useEffect, useState } from 'react';
import { useLocalStorage } from './useLocalStorage';
import { WorkoutSession, WorkoutPlan, WorkoutExercise, BodyWeightEntry } from '../types';
import { supabase } from '../lib/supabase';

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
  const [workouts, setWorkouts] = useLocalStorage<WorkoutSession[]>('fittrack_workouts', []);
  const [plans, setPlans] = useLocalStorage<WorkoutPlan[]>('fittrack_plans', SAMPLE_PLANS);
  const [activeExercises, setActiveExercises] = useLocalStorage<WorkoutExercise[]>('fittrack_active_exercises', []);
  const [activeStartTime, setActiveStartTime] = useLocalStorage<number | null>('fittrack_active_start_time', null);
  // Theo dõi cân nặng cơ thể
  const [bodyWeightLog, setBodyWeightLog] = useLocalStorage<BodyWeightEntry[]>('fittrack_bodyweight', []);
  // Danh sách ID các bài tập yêu thích
  const [favoriteExerciseIds, setFavoriteExerciseIds] = useLocalStorage<string[]>('fittrack_favorites', []);

  // Trạng thái đồng bộ đám mây
  const [isCloudSyncing, setIsCloudSyncing] = useState<boolean>(false);

  // 1. Tải dữ liệu từ Supabase khi mở ứng dụng (Ưu tiên đám mây, nếu có mạng)
  useEffect(() => {
    let isMounted = true;

    async function loadCloudData() {
      try {
        setIsCloudSyncing(true);

        // Lấy danh sách buổi tập từ Supabase
        const { data: cloudWorkouts, error: wError } = await supabase
          .from('workouts')
          .select('*')
          .order('date', { ascending: false });

        if (!wError && cloudWorkouts && isMounted) {
          const parsedWorkouts: WorkoutSession[] = cloudWorkouts.map((row) => ({
            id: row.id,
            date: row.date,
            duration: row.duration,
            notes: row.notes,
            exercises: typeof row.exercises === 'string' ? JSON.parse(row.exercises) : row.exercises
          }));
          setWorkouts(parsedWorkouts);
        } else if (isMounted) {
          // Xóa toàn bộ dữ liệu mẫu cũ (sample-workout-*) còn sót trong máy người dùng
          setWorkouts((prev) => prev.filter((w) => !w.id.startsWith('sample-workout-')));
        }

        // Lấy lịch sử cân nặng từ Supabase
        const { data: cloudBw, error: bError } = await supabase
          .from('bodyweight')
          .select('*')
          .order('date', { ascending: false });

        if (!bError && cloudBw && cloudBw.length > 0 && isMounted) {
          const parsedBw: BodyWeightEntry[] = cloudBw.map((row) => ({
            id: row.id,
            date: row.date,
            weight: Number(row.weight),
            note: row.note
          }));
          setBodyWeightLog(parsedBw);
        }

        // Lấy bài tập yêu thích từ Supabase
        const { data: cloudFavorites, error: fError } = await supabase
          .from('app_state')
          .select('value')
          .eq('key', 'favorites')
          .single();

        if (!fError && cloudFavorites && Array.isArray(cloudFavorites.value) && isMounted) {
          setFavoriteExerciseIds(cloudFavorites.value);
        }
      } catch (err) {
        console.warn('Không thể đồng bộ từ Supabase, sử dụng bộ nhớ nội bộ:', err);
      } finally {
        if (isMounted) setIsCloudSyncing(false);
      }
    }

    loadCloudData();

    return () => {
      isMounted = false;
    };
  }, []);

  // Bật/tắt trạng thái yêu thích của một bài tập và đẩy lên Supabase
  const toggleFavoriteExercise = (exerciseId: string) => {
    setFavoriteExerciseIds((prev) => {
      const nextFavorites = prev.includes(exerciseId)
        ? prev.filter((id) => id !== exerciseId)
        : [...prev, exerciseId];

      // Đẩy lên Supabase ngầm
      supabase
        .from('app_state')
        .upsert({ key: 'favorites', value: nextFavorites, updated_at: new Date().toISOString() })
        .then(({ error }) => {
          if (error) console.error('Lỗi lưu yêu thích:', error);
        });

      return nextFavorites;
    });
  };

  // Thêm buổi tập mới vào lịch sử và Supabase
  const saveWorkout = (session: Omit<WorkoutSession, 'id'>) => {
    const newSession: WorkoutSession = {
      ...session,
      id: 'workout-' + Date.now()
    };
    setWorkouts((prev) => [newSession, ...prev]);
    setActiveExercises([]);
    setActiveStartTime(null);

    // Đồng bộ lên Supabase
    supabase
      .from('workouts')
      .insert({
        id: newSession.id,
        date: newSession.date,
        duration: newSession.duration,
        exercises: newSession.exercises,
        notes: newSession.notes
      })
      .then(({ error }) => {
        if (error) console.error('Lỗi lưu buổi tập lên Supabase:', error);
      });

    return newSession;
  };

  // Xóa một buổi tập khỏi lịch sử và Supabase
  const deleteWorkout = (id: string) => {
    setWorkouts((prev) => prev.filter((w) => w.id !== id));
    supabase
      .from('workouts')
      .delete()
      .eq('id', id)
      .then(({ error }) => {
        if (error) console.error('Lỗi xóa buổi tập trên Supabase:', error);
      });
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

  // Lưu bản ghi cân nặng mới (hỗ trợ ngày tùy chọn) và đẩy lên Supabase
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

    // Đồng bộ lên Supabase
    supabase
      .from('bodyweight')
      .insert({
        id: entry.id,
        date: entry.date,
        weight: entry.weight,
        note: entry.note
      })
      .then(({ error }) => {
        if (error) console.error('Lỗi lưu cân nặng lên Supabase:', error);
      });

    return entry;
  };

  // Xóa bản ghi cân nặng khỏi Supabase
  const deleteBodyWeight = (id: string) => {
    setBodyWeightLog((prev) => prev.filter((e) => e.id !== id));
    supabase
      .from('bodyweight')
      .delete()
      .eq('id', id)
      .then(({ error }) => {
        if (error) console.error('Lỗi xóa cân nặng trên Supabase:', error);
      });
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
    toggleFavoriteExercise,
    isCloudSyncing
  };
}

