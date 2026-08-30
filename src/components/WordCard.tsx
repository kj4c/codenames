import type { Card } from '../types'

export type RevealAnimation = 'correct' | 'neutral' | 'wrong' | 'assassin'

interface WordCardProps {
  card: Card
  spymasterView: boolean
  interactive: boolean
  revealAnimation: RevealAnimation | null
  onReveal: (id: number) => void
  disabled: boolean
}

export function WordCard({
  card,
  spymasterView,
  interactive,
  revealAnimation,
  onReveal,
  disabled,
}: WordCardProps) {
  const showType = spymasterView || card.revealed
  const isAnimating = revealAnimation !== null

  return (
    <button
      type="button"
      className={[
        'word-card',
        showType && `word-card--${card.type}`,
        card.revealed && 'word-card--revealed',
        interactive && !card.revealed && 'word-card--interactive',
        isAnimating && `word-card--anim-${revealAnimation}`,
      ]
        .filter(Boolean)
        .join(' ')}
      onClick={() => !card.revealed && !disabled && onReveal(card.id)}
      disabled={card.revealed || disabled}
      aria-label={card.word}
    >
      <div className="word-card__stripe word-card__stripe--top" />
      <span className="word-card__text">{card.word}</span>
      <div className="word-card__stripe word-card__stripe--bottom" />

      {revealAnimation === 'correct' && (
        <>
          <div className="word-card__burst word-card__burst--correct" />
          <span className="word-card__badge word-card__badge--correct">✓</span>
        </>
      )}
      {revealAnimation === 'neutral' && (
        <>
          <div className="word-card__burst word-card__burst--neutral" />
          <span className="word-card__badge word-card__badge--neutral">
            NEUTRAL
          </span>
        </>
      )}
      {revealAnimation === 'wrong' && (
        <>
          <div className="word-card__burst word-card__burst--wrong" />
          <span className="word-card__badge word-card__badge--wrong">✗</span>
        </>
      )}
      {revealAnimation === 'assassin' && (
        <>
          <div className="word-card__burst word-card__burst--assassin" />
          <span className="word-card__badge word-card__badge--assassin">☠</span>
        </>
      )}
    </button>
  )
}
