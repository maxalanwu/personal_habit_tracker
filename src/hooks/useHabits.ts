import { useCallback, useEffect, useState } from 'react';
import {
  createHabit,
  loadHabits,
  saveHabits,
  toggleToday,
  type Habit,
} from '../lib/habits';

export function useHabits() {
  const [habits, setHabits] = useState<Habit[]>(() => loadHabits());

  useEffect(() => {
    saveHabits(habits);
  }, [habits]);

  const addHabit = useCallback((name: string, emoji: string) => {
    setHabits((prev) => [...prev, createHabit(name, emoji)]);
  }, []);

  const removeHabit = useCallback((id: string) => {
    setHabits((prev) => prev.filter((h) => h.id !== id));
  }, []);

  const toggleHabitToday = useCallback((id: string) => {
    setHabits((prev) => prev.map((h) => (h.id === id ? toggleToday(h) : h)));
  }, []);

  return { habits, addHabit, removeHabit, toggleHabitToday };
}
