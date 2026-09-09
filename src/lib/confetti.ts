/**
 * Tiny dependency-free confetti burst. Spawns a handful of colored shards at a
 * screen point, animates them outward with the Web Animations API, and cleans
 * up after itself. No-ops when the user prefers reduced motion.
 */

const COLORS = ['#12b26b', '#22c980', '#0aa79a', '#f97316', '#fbbf24', '#34d399'];

export function confettiBurst(x: number, y: number): void {
  if (typeof window === 'undefined') return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const container = document.createElement('div');
  container.setAttribute('aria-hidden', 'true');
  container.style.cssText = `position:fixed;left:0;top:0;width:0;height:0;z-index:60;pointer-events:none;`;
  document.body.appendChild(container);

  const count = 14;
  for (let i = 0; i < count; i++) {
    const shard = document.createElement('div');
    const size = 6 + Math.random() * 5;
    const color = COLORS[Math.floor(Math.random() * COLORS.length)];
    shard.style.cssText = `position:absolute;left:${x}px;top:${y}px;width:${size}px;height:${size * 0.4}px;background:${color};border-radius:1px;will-change:transform,opacity;`;
    container.appendChild(shard);

    const angle = (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.6;
    const distance = 60 + Math.random() * 70;
    const dx = Math.cos(angle) * distance;
    const dy = Math.sin(angle) * distance - 30; // bias upward
    const rotate = (Math.random() - 0.5) * 720;

    shard.animate(
      [
        { transform: 'translate(0,0) rotate(0deg)', opacity: 1 },
        {
          transform: `translate(${dx}px, ${dy + 90}px) rotate(${rotate}deg)`,
          opacity: 0,
        },
      ],
      {
        duration: 700 + Math.random() * 400,
        easing: 'cubic-bezier(0.2, 0.7, 0.3, 1)',
        fill: 'forwards',
      },
    );
  }

  window.setTimeout(() => container.remove(), 1300);
}
