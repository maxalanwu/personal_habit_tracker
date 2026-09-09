import { currentStreak } from '../lib/dates';
import { isDoneToday, type Habit } from '../lib/habits';

interface Props {
  habit: Habit;
  onToggle: (id: string) => void;
  onRemove: (id: string) => void;
}

export function HabitCard({ habit, onToggle, onRemove }: Props) {
  const done = isDoneToday(habit);
  const streak = currentStreak(habit.completions);

  return (
    <li className={`habit-card${done ? ' done' : ''}`}>
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
        type="button"
        className={`habit-check${done ? ' checked' : ''}`}
        onClick={() => onToggle(habit.id)}
        aria-pressed={done}
        aria-label={`Mark ${habit.name} done for today`}
      >
        <span className="habit-check-burst" aria-hidden="true" />
        <span className="habit-check-mark" aria-hidden="true">
          ✓
        </span>
      </button>
    </li>
  );
}
