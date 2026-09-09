import { useState } from 'react';
import { AddHabitForm } from './components/AddHabitForm';
import { HabitCard } from './components/HabitCard';
import { WeeklyGrid } from './components/WeeklyGrid';
import { useHabits } from './hooks/useHabits';
import { isDoneToday } from './lib/habits';

type View = 'today' | 'week';

export default function App() {
  const { habits, addHabit, removeHabit, toggleHabitToday } = useHabits();
  const [view, setView] = useState<View>('today');

  const doneCount = habits.filter(isDoneToday).length;
  const today = new Date().toLocaleDateString(undefined, {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="app">
      <header className="app-header">
        <p className="app-date">{today}</p>
        <h1 className="app-title">Habits</h1>
        {habits.length > 0 && (
          <p className="app-progress">
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
          <div className="view-toggle" role="tablist" aria-label="Choose a view">
            <span className={`view-toggle-thumb ${view}`} aria-hidden="true" />
            <button
              type="button"
              role="tab"
              aria-selected={view === 'today'}
              className={`view-toggle-btn${view === 'today' ? ' active' : ''}`}
              onClick={() => setView('today')}
            >
              Today
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={view === 'week'}
              className={`view-toggle-btn${view === 'week' ? ' active' : ''}`}
              onClick={() => setView('week')}
            >
              Week
            </button>
          </div>

          <div className="view-stage">
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
