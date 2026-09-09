import { useEffect, useRef, useState } from 'react';

const EMOJI_CHOICES = ['🏃', '📚', '💧', '🧘', '💪', '🥗', '😴', '✍️', '🎸', '🧹', '☎️', '🌱'];

interface Props {
  onAdd: (name: string, emoji: string) => void;
}

export function AddHabitForm({ onAdd }: Props) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [emoji, setEmoji] = useState(EMOJI_CHOICES[0]);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!open) return;
    inputRef.current?.focus();

    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false);
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  function openModal() {
    setName('');
    setEmoji(EMOJI_CHOICES[0]);
    setOpen(true);
  }

  function handleSubmit(e: React.SyntheticEvent) {
    e.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) return;
    onAdd(trimmed, emoji);
    setOpen(false);
  }

  return (
    <>
      <button type="button" className="add-trigger" onClick={openModal}>
        <span className="add-button-plus" aria-hidden="true">
          +
        </span>
        Add habit
      </button>

      {open && (
        <div
          className="modal-backdrop"
          onClick={() => setOpen(false)}
          role="presentation"
        >
          <form
            className="modal"
            onClick={(e) => e.stopPropagation()}
            onSubmit={handleSubmit}
            role="dialog"
            aria-modal="true"
            aria-label="Add a habit"
          >
            <div className="modal-preview" aria-hidden="true">
              {emoji}
            </div>

            <div className="emoji-row">
              {EMOJI_CHOICES.map((choice) => (
                <button
                  type="button"
                  key={choice}
                  className={`emoji-choice${choice === emoji ? ' selected' : ''}`}
                  onClick={() => setEmoji(choice)}
                  aria-pressed={choice === emoji}
                  aria-label={`Choose ${choice}`}
                >
                  {choice}
                </button>
              ))}
            </div>

            <input
              ref={inputRef}
              className="add-input"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSubmit(e);
              }}
              placeholder="Habit name, e.g. Morning run"
              maxLength={40}
              aria-label="Habit name"
            />

            <div className="modal-actions">
              <button
                type="button"
                className="modal-cancel"
                onClick={() => setOpen(false)}
              >
                Cancel
              </button>
              <button type="submit" className="add-button" disabled={!name.trim()}>
                Save
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
}
