import { todayKey } from './dates';

export interface Habit {
  id: string;
  name: string;
  emoji: string;
  createdAt: string;
  /** Local day keys ("YYYY-MM-DD") on which the habit was completed. */
  completions: string[];
}

export const STORAGE_KEY = 'habit-tracker:habits:v1';

export function loadHabits(): Habit[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(isHabit);
  } catch (err) {
    console.warn('[habits] could not read from localStorage:', err);
    return [];
  }
}

export function saveHabits(habits: Habit[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(habits));
  } catch (err) {
    // Storage full, or unavailable (private mode / file:// origin).
    console.warn('[habits] could not write to localStorage:', err);
  }
}

function isHabit(value: unknown): value is Habit {
  if (typeof value !== 'object' || value === null) return false;
  const h = value as Record<string, unknown>;
  return (
    typeof h.id === 'string' &&
    typeof h.name === 'string' &&
    typeof h.emoji === 'string' &&
    typeof h.createdAt === 'string' &&
    Array.isArray(h.completions)
  );
}

export function createHabit(name: string, emoji: string): Habit {
  return {
    id: crypto.randomUUID(),
    name: name.trim(),
    emoji: emoji.trim() || '✅',
    createdAt: new Date().toISOString(),
    completions: [],
  };
}

/** Toggle today's completion for a habit, returning a new Habit object. */
export function toggleToday(habit: Habit): Habit {
  const key = todayKey();
  const done = habit.completions.includes(key);
  return {
    ...habit,
    completions: done
      ? habit.completions.filter((k) => k !== key)
      : [...habit.completions, key],
  };
}

export function isDoneToday(habit: Habit): boolean {
  return habit.completions.includes(todayKey());
}
