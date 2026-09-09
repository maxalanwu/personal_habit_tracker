import { AddHabitForm } from './components/AddHabitForm';
import { HabitCard } from './components/HabitCard';
import { WeeklyGrid } from './components/WeeklyGrid';
import { useHabits } from './hooks/useHabits';
import { isDoneToday } from './lib/habits';

export default function App() {
  const { habits, addHabit, removeHabit, toggleHabitToday } = useHabits();

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

      <AddHabitForm onAdd={addHabit} />

      {habits.length === 0 ? (
        <p className="empty-state">
          No habits yet. Add one above to start building a streak.
        </p>
      ) : (
        <>
          <ul className="habit-list">
            {habits.map((habit) => (
              <HabitCard
                key={habit.id}
                habit={habit}
                onToggle={toggleHabitToday}
                onRemove={removeHabit}
              />
            ))}
          </ul>

          <section className="week-section">
            <h2 className="section-title">This week</h2>
            <WeeklyGrid habits={habits} />
          </section>
        </>
      )}
    </div>
  );
}
