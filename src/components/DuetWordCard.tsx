import type { DuetCard, DuetDisplayType, Player } from '../types'
import { getCardDisplayType } from '../utils/duetGameLogic'

export type RevealAnimation = 'correct' | 'neutral' | 'wrong' | 'assassin'

interface DuetWordCardProps {
  card: DuetCard
  viewingPlayer: Player | null
  spymasterView: boolean
  showAllKeys: boolean
  interactive: boolean
  revealAnimation: RevealAnimation | null
  onReveal: (id: number) => void
  disabled: boolean
}

export function DuetWordCard({
  card,
  viewingPlayer,
  spymasterView,
  showAllKeys,
  interactive,
  revealAnimation,
  onReveal,
  disabled,
}: DuetWordCardProps) {
  const displayType: DuetDisplayType = getCardDisplayType(
    card,
    viewingPlayer,
    spymasterView,
    showAllKeys
  )
  const isAnimating = revealAnimation !== null

  return (
    <button
      type="button"
      className={[
        'word-card',
        displayType && `word-card--${displayType}`,
        card.revealed && 'word-card--revealed',
        interactive && !card.revealed && 'word-card--interactive',
        interactive && !card.revealed && 'word-card--interactive-duet',
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

      {card.tokenMarker && card.revealed && (
        <span
          className={`word-card__token-marker word-card__token-marker--${card.tokenMarker}`}
          aria-hidden
        >
          ⏱
        </span>
      )}

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
            BYSTANDER
          </span>
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
