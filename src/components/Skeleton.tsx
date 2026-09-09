/** Placeholder shown for a beat while the app boots. */
export function Skeleton() {
  return (
    <div className="skeleton-wrap" aria-hidden="true">
      <div className="skeleton skeleton-line sk-date" />
      <div className="skeleton skeleton-line sk-title" />
      <div className="skeleton skeleton-line sk-motto" />
      <div className="skeleton sk-toggle" />
      <div className="skeleton sk-trigger" />
      <div className="skeleton sk-card" />
      <div className="skeleton sk-card" />
      <div className="skeleton sk-card" />
      <span className="sr-only">Loading your habits…</span>
    </div>
  );
}
