import { useRef, useState } from 'react';
import { confettiBurst } from '../lib/confetti';
import { currentStreak } from '../lib/dates';
import { isDoneToday, type Habit } from '../lib/habits';

interface Props {
  habit: Habit;
  /** True when no habit has been completed yet today (before this toggle). */
  firstOfDay: boolean;
  onToggle: (id: string) => void;
  onRemove: (id: string) => void;
}

export function HabitCard({ habit, firstOfDay, onToggle, onRemove }: Props) {
  const done = isDoneToday(habit);
  const streak = currentStreak(habit.completions);
  const checkRef = useRef<HTMLButtonElement>(null);
  const [pulse, setPulse] = useState(false);

  function handleToggle() {
    const completing = !done;

    if (completing) {
      // A short buzz on devices that support it — the "haptic" feel.
      if (typeof navigator.vibrate === 'function') navigator.vibrate(12);

      // A quick physical nudge on the card.
      setPulse(true);
      window.setTimeout(() => setPulse(false), 450);

      // First completion of the day earns a little confetti.
      if (firstOfDay && checkRef.current) {
        const r = checkRef.current.getBoundingClientRect();
        confettiBurst(r.left + r.width / 2, r.top + r.height / 2);
      }
    }

    onToggle(habit.id);
  }

  return (
    <li
      className={`habit-card${done ? ' done' : ''}${pulse ? ' pulse' : ''}`}
    >
      <span className="habit-emoji" aria-hidden="true">
        {habit.emoji}
      </span>

      <span className="habit-body">
        <span className="habit-name">{habit.name}</span>
        <span className="habit-streak">
          {streak > 0 ? `🔥 ${streak} day${streak === 1 ? '' : 's'}` : 'No streak yet'}
        </span>
      </span>

      <button
        type="button"
        className="habit-remove"
        onClick={() => onRemove(habit.id)}
        aria-label={`Delete ${habit.name}`}
      >
        ✕
      </button>

      <button
        ref={checkRef}
        type="button"
        className={`habit-check${done ? ' checked' : ''}`}
        onClick={handleToggle}
        aria-pressed={done}
        aria-label={
          done
            ? `${habit.name}: done today. Tap to undo.`
            : `Mark ${habit.name} done for today`
        }
      >
        <span className="habit-check-burst" aria-hidden="true" />
        <svg
          className="habit-check-mark"
          viewBox="0 0 24 24"
          fill="none"
          aria-hidden="true"
        >
          <path
            d="M5 13l4 4L19 7"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
    </li>
  );
}
