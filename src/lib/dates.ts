/** Date helpers. All habit completions are keyed by local calendar day: "YYYY-MM-DD". */

/** Local-time ISO day key, e.g. "2026-09-09". */
export function dayKey(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function todayKey(): string {
  return dayKey(new Date());
}

/** Returns a new date `n` days offset from `date` (n may be negative). */
export function addDays(date: Date, n: number): Date {
  const copy = new Date(date);
  copy.setDate(copy.getDate() + n);
  return copy;
}

const WEEKDAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export interface WeekDay {
  key: string;
  label: string;
  dayOfMonth: number;
  isToday: boolean;
}

/**
 * The last 7 calendar days ending today, oldest first — the window shown in the
 * weekly grid.
 */
export function lastSevenDays(now: Date = new Date()): WeekDay[] {
  const today = todayKey();
  return Array.from({ length: 7 }, (_, i) => {
    const date = addDays(now, i - 6);
    return {
      key: dayKey(date),
      label: WEEKDAY_LABELS[date.getDay()],
      dayOfMonth: date.getDate(),
      isToday: dayKey(date) === today,
    };
  });
}

/**
 * Length of the run of consecutive completed days ending today (or yesterday, so
 * a streak isn't considered broken until a full day has been missed).
 */
export function currentStreak(completions: Iterable<string>, now: Date = new Date()): number {
  const done = completions instanceof Set ? completions : new Set(completions);
  if (done.size === 0) return 0;

  let cursor = new Date(now);
  // Allow the streak to "hang" from yesterday if today isn't checked off yet.
  if (!done.has(dayKey(cursor))) {
    cursor = addDays(cursor, -1);
    if (!done.has(dayKey(cursor))) return 0;
  }

  let streak = 0;
  while (done.has(dayKey(cursor))) {
    streak += 1;
    cursor = addDays(cursor, -1);
  }
  return streak;
}
