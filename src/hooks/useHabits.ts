import { useCallback, useEffect, useRef, useState } from 'react';
import {
  createHabit,
  loadHabits,
  saveHabits,
  STORAGE_KEY,
  toggleToday,
  type Habit,
} from '../lib/habits';

export function useHabits() {
  const [habits, setHabits] = useState<Habit[]>(() => loadHabits());

  // Don't write storage on the very first render — we only just read from it.
  // Persisting the initial value would clobber good data if the load ever
  // failed (e.g. transient error) and returned an empty list.
  const hydrated = useRef(false);

  useEffect(() => {
    if (!hydrated.current) {
      hydrated.current = true;
      return;
    }
    saveHabits(habits);
  }, [habits]);

  // Keep this tab in sync when another tab/window changes the same data.
  useEffect(() => {
    function onStorage(e: StorageEvent) {
      if (e.key === null || e.key === STORAGE_KEY) {
        setHabits(loadHabits());
      }
    }
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

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
