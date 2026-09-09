import { dayKey } from './dates';

/** Short, low-key nudges. One is shown per day, the same one all day. */
const MESSAGES = [
  'Small steps, every day.',
  'Consistency beats intensity.',
  "Show up — that's the whole trick.",
  'One rep is better than none.',
  'Progress, not perfection.',
  "Today's a good day to keep the streak.",
  'The habit is the reward.',
  'Do it while it’s easy to.',
  'Future you is watching.',
  'Keep the chain unbroken.',
  'Start before you feel ready.',
  'A little bit counts.',
  'Momentum is on your side.',
  'Make it too small to fail.',
];

/** Deterministic message for a given day, so it doesn't flicker on re-render. */
export function dailyMessage(now: Date = new Date()): string {
  const key = dayKey(now); // "YYYY-MM-DD"
  let hash = 0;
  for (let i = 0; i < key.length; i++) {
    hash = (hash * 31 + key.charCodeAt(i)) | 0;
  }
  return MESSAGES[Math.abs(hash) % MESSAGES.length];
}
