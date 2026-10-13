import React from 'react';
import styles from './BottomNav.module.css';
import { NavTab } from '../../types';

interface BottomNavProps {
  currentTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  hasActiveWorkout?: boolean;
}

interface NavItemConfig {
  id: NavTab;
  label: string;
  icon: string;
}

const NAV_ITEMS: NavItemConfig[] = [
  { id: 'home', label: 'Tổng quan', icon: '🏠' },
  { id: 'active', label: 'Tập luyện', icon: '⚡' },
  { id: 'weight', label: 'Cân nặng', icon: '⚖️' },
  { id: 'progress', label: 'Tiến độ', icon: '📈' },
  { id: 'history', label: 'Lịch sử', icon: '📅' },
  { id: 'library', label: 'Bài tập', icon: '📚' }
];

export const BottomNav: React.FC<BottomNavProps> = ({
  currentTab,
  onSelectTab,
  hasActiveWorkout = false
}) => {
  return (
    <nav className={styles.bottomNav}>
      {NAV_ITEMS.map((item) => {
        const isActive = currentTab === item.id;
        const showBadge = item.id === 'active' && hasActiveWorkout;

        return (
          <button
            key={item.id}
            type="button"
            className={`${styles.navItem} ${isActive ? styles.active : ''}`}
            onClick={() => onSelectTab(item.id)}
            aria-label={item.label}
          >
            {isActive && <div className={styles.activeDot} />}
            {showBadge && <div className={styles.activeWorkoutBadge} />}
            <span className={styles.icon}>{item.icon}</span>
            <span className={styles.label}>{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
};
