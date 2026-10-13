// Định nghĩa các interface và kiểu dữ liệu TypeScript cho ứng dụng FitTrack

export type MuscleCategory = 'Ngực' | 'Lưng' | 'Chân' | 'Vai' | 'Tay' | 'Thể Trọng';

export interface Exercise {
  id: string;
  name: string;
  category: MuscleCategory;
  muscleGroups: string[];
  description: string;
  instructions: string[];
  isBodyweight?: boolean; // true = bài tập không cần tạ
}

export interface WorkoutSet {
  id: string;
  reps: number;
  weight: number;         // 0 nếu là bài thể trọng
  isBodyweight?: boolean; // true = không cần tạ (tính bằng reps)
  completed: boolean;
  restTime: number;       // Thời gian nghỉ tính bằng giây
}

export interface WorkoutExercise {
  exerciseId: string;
  exerciseName: string;
  sets: WorkoutSet[];
}

export interface WorkoutSession {
  id: string;
  date: string; // ISO string
  exercises: WorkoutExercise[];
  duration: number; // Tổng thời lượng buổi tập tính bằng giây
  notes?: string;
}

export interface WorkoutPlanDay {
  dayName: string;
  exercises: string[]; // Danh sách exerciseId
}

export interface WorkoutPlan {
  id: string;
  name: string;
  days: WorkoutPlanDay[];
}

// Bản ghi cân nặng cơ thể theo ngày
export interface BodyWeightEntry {
  id: string;
  date: string;    // ISO string
  weight: number;  // kg
  note?: string;
}

export type NavTab = 'home' | 'active' | 'weight' | 'progress' | 'history' | 'library';

