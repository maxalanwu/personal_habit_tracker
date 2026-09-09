import { lastSevenDays } from '../lib/dates';
import type { Habit } from '../lib/habits';

interface Props {
  habits: Habit[];
}

export function WeeklyGrid({ habits }: Props) {
  const days = lastSevenDays();

  return (
    <div className="weekly-grid" role="table" aria-label="Weekly completion grid">
      <div className="grid-row grid-head" role="row">
        <span className="grid-label" role="columnheader">
          Last 7 days
        </span>
        {days.map((day) => (
          <span
            key={day.key}
            className={`grid-day-head${day.isToday ? ' today' : ''}`}
            role="columnheader"
          >
            <span className="grid-day-label">{day.label}</span>
            <span className="grid-day-num">{day.dayOfMonth}</span>
          </span>
        ))}
      </div>

      {habits.map((habit) => {
        const done = new Set(habit.completions);
        return (
          <div className="grid-row" role="row" key={habit.id}>
            <span className="grid-label" role="rowheader">
              <span className="grid-label-emoji">{habit.emoji}</span>
              <span className="grid-label-name">{habit.name}</span>
            </span>
            {days.map((day) => (
              <span
                key={day.key}
                className={`grid-cell${done.has(day.key) ? ' filled' : ''}`}
                role="cell"
                aria-label={`${habit.name} ${day.label}: ${done.has(day.key) ? 'done' : 'not done'}`}
              />
            ))}
          </div>
        );
      })}
    </div>
  );
}
