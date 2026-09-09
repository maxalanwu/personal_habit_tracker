import { useEffect, useState } from 'react';
import { AddHabitForm } from './components/AddHabitForm';
import { HabitCard } from './components/HabitCard';
import { Skeleton } from './components/Skeleton';
import { WeeklyGrid } from './components/WeeklyGrid';
import { useHabits } from './hooks/useHabits';
import { isDoneToday } from './lib/habits';
import { dailyMessage } from './lib/motivation';

type View = 'today' | 'week';

export default function App() {
  const { habits, addHabit, removeHabit, toggleHabitToday } = useHabits();
  const [view, setView] = useState<View>('today');
  const [pending, setPending] = useState(false);
  const [booted, setBooted] = useState(false);

  // Brief skeleton on first paint so the app resolves in rather than snapping.
  useEffect(() => {
    const id = window.setTimeout(() => setBooted(true), 320);
    return () => window.clearTimeout(id);
  }, []);

  function changeView(next: View) {
    if (next === view || pending) return;
    setPending(true);
    window.setTimeout(() => {
      setView(next);
      setPending(false);
    }, 150);
  }

  const doneCount = habits.filter(isDoneToday).length;
  const today = new Date().toLocaleDateString(undefined, {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });
  const motto = dailyMessage();

  if (!booted) {
    return (
      <div className="app">
        <Skeleton />
      </div>
    );
  }

  return (
    <div className="app app-enter">
      <header className="app-header">
        <p className="app-date">{today}</p>
        <h1 className="app-title">Habits</h1>
        <p className="app-motto">{motto}</p>
        {habits.length > 0 && (
          <p className="app-progress" aria-live="polite">
            {doneCount} of {habits.length} done today
          </p>
        )}
      </header>

      {habits.length === 0 ? (
        <div className="empty-state">
          <div className="empty-art" aria-hidden="true">
            <span>🏃</span>
            <span>📚</span>
            <span>🧘</span>
            <span>💧</span>
            <span>🌱</span>
          </div>
          <h2 className="empty-title">Build your first habit</h2>
          <p className="empty-text">
            Pick one small thing you want to do every day. Check it off, and
            watch the streak grow.
          </p>
          <AddHabitForm onAdd={addHabit} />
        </div>
      ) : (
        <>
          <div className="view-toggle" role="group" aria-label="Choose a view">
            <span className={`view-toggle-thumb ${view}`} aria-hidden="true" />
            <button
              type="button"
              aria-pressed={view === 'today'}
              className={`view-toggle-btn${view === 'today' ? ' active' : ''}`}
              onClick={() => changeView('today')}
            >
              Today
            </button>
            <button
              type="button"
              aria-pressed={view === 'week'}
              className={`view-toggle-btn${view === 'week' ? ' active' : ''}`}
              onClick={() => changeView('week')}
            >
              Week
            </button>
          </div>

          <div
            className={`view-stage${pending ? ' loading' : ''}`}
            aria-busy={pending}
          >
            {view === 'today' ? (
              <div className="view-panel" key="today">
                <AddHabitForm onAdd={addHabit} />
                <ul className="habit-list">
                  {habits.map((habit) => (
                    <HabitCard
                      key={habit.id}
                      habit={habit}
                      firstOfDay={doneCount === 0}
                      onToggle={toggleHabitToday}
                      onRemove={removeHabit}
                    />
                  ))}
                </ul>
              </div>
            ) : (
              <div className="view-panel" key="week">
                <section className="week-section">
                  <h2 className="section-title">This week</h2>
                  <WeeklyGrid habits={habits} />
                </section>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
