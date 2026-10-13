import { useState, useEffect } from 'react';

// Custom hook quản lý lưu trữ trạng thái vào localStorage
export function useLocalStorage<T>(key: string, initialValue: T): [T, React.Dispatch<React.SetStateAction<T>>] {
  // Lấy dữ liệu khởi tạo từ localStorage nếu có
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Lỗi khi đọc key "${key}" từ localStorage:`, error);
      return initialValue;
    }
  });

  // Lưu giá trị vào localStorage mỗi khi state thay đổi
  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(storedValue));
    } catch (error) {
      console.error(`Lỗi khi lưu key "${key}" vào localStorage:`, error);
    }
  }, [key, storedValue]);

  return [storedValue, setStoredValue];
}
