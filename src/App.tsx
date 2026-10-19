import React, { useState } from 'react';
import styles from './App.module.css';
import { NavTab, Exercise, WorkoutPlan, WorkoutExercise } from './types';
import { useWorkout } from './hooks/useWorkout';
import { INITIAL_EXERCISES } from './data/exercises';
import { BottomNav } from './components/BottomNav/BottomNav';
import { Home } from './pages/Home/Home';
import { ActiveWorkout } from './pages/ActiveWorkout/ActiveWorkout';
import { Weight } from './pages/Weight/Weight';
import { History } from './pages/History/History';
import { Progress } from './pages/Progress/Progress';
import { Library } from './pages/Library/Library';

export const App: React.FC = () => {
  const [currentTab, setCurrentTab] = useState<NavTab>('home');

  const {
    workouts,
    plans,
    activeExercises,
    setActiveExercises,
    activeStartTime,
    setActiveStartTime,
    bodyWeightLog,
    saveWorkout,
    deleteWorkout,
    saveBodyWeight,
    deleteBodyWeight,
    calculateSessionVolume,
    calculateSessionBodyweightReps,
    getWorkoutsThisWeek,
    getWeeklyVolume,
    getWeeklyBodyweightReps,
    getStreakCount,
    favoriteExerciseIds,
    toggleFavoriteExercise
  } = useWorkout();

  // Thêm bài tập vào buổi tập đang diễn ra
  const handleAddExerciseToActive = (exercise: Exercise) => {
    setActiveExercises((prev) => {
      if (prev.some((e) => e.exerciseId === exercise.id)) return prev;
      return [
        ...prev,
        {
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
        }
      ];
    });

    if (!activeStartTime) {
      setActiveStartTime(Date.now());
    }
  };

  // Chọn giáo án từ trang chủ để nạp các bài tập vào buổi tập ngay
  const handleSelectPlanDay = (plan: WorkoutPlan, dayIndex: number) => {
    const targetDay = plan.days[dayIndex];
    if (!targetDay) return;

    const newActiveExercises: WorkoutExercise[] = [];
    targetDay.exercises.forEach((exId) => {
      const found = INITIAL_EXERCISES.find((e) => e.id === exId);
      if (found) {
        newActiveExercises.push({
          exerciseId: found.id,
          exerciseName: found.name,
          sets: [
            {
              id: 'set-' + Math.random().toString(36).substring(2, 9),
              weight: 0,
              reps: 10,
              completed: false,
              restTime: 60
            },
            {
              id: 'set-' + Math.random().toString(36).substring(2, 9),
              weight: 0,
              reps: 10,
              completed: false,
              restTime: 60
            },
            {
              id: 'set-' + Math.random().toString(36).substring(2, 9),
              weight: 0,
              reps: 10,
              completed: false,
              restTime: 60
            }
          ]
        });
      }
    });

    setActiveExercises(newActiveExercises);
    setActiveStartTime(Date.now());
    setCurrentTab('active');
  };

  return (
    <div className={styles.appShell}>
      <main className={styles.mainContent}>
        {currentTab === 'home' && (
          <Home
            workouts={workouts}
            plans={plans}
            onNavigate={setCurrentTab}
            streakCount={getStreakCount()}
            weeklyWorkoutsCount={getWorkoutsThisWeek().length}
            weeklyVolume={getWeeklyVolume()}
            weeklyBodyweightReps={getWeeklyBodyweightReps()}
            calculateVolume={calculateSessionVolume}
            calculateBodyweightReps={calculateSessionBodyweightReps}
            onSelectPlan={handleSelectPlanDay}
            bodyWeightLog={bodyWeightLog}
          />
        )}


        {currentTab === 'active' && (
          <ActiveWorkout
            activeExercises={activeExercises}
            setActiveExercises={setActiveExercises}
            activeStartTime={activeStartTime}
            setActiveStartTime={setActiveStartTime}
            favoriteExerciseIds={favoriteExerciseIds}
            workouts={workouts}
            onSaveWorkout={saveWorkout}
            onNavigate={setCurrentTab}
          />
        )}

        {currentTab === 'weight' && (
          <Weight
            bodyWeightLog={bodyWeightLog}
            onSaveBodyWeight={saveBodyWeight}
            onDeleteBodyWeight={deleteBodyWeight}
          />
        )}

        {currentTab === 'history' && (
          <History
            workouts={workouts}
            onDeleteWorkout={deleteWorkout}
            calculateVolume={calculateSessionVolume}
          />
        )}

        {currentTab === 'progress' && (
          <Progress
            workouts={workouts}
            favoriteExerciseIds={favoriteExerciseIds}
          />
        )}

        {currentTab === 'library' && (
          <Library
            favoriteExerciseIds={favoriteExerciseIds}
            workouts={workouts}
            onToggleFavorite={toggleFavoriteExercise}
            onAddToWorkout={handleAddExerciseToActive}
            onNavigate={setCurrentTab}
          />
        )}
      </main>

      {/* Thanh điều hướng dưới màn hình */}
      <BottomNav
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        hasActiveWorkout={activeExercises.length > 0}
      />
    </div>
  );
};

export default App;
