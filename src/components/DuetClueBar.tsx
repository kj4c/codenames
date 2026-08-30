import { useState, type FormEvent } from 'react'
import type { DuetClue, Player } from '../types'
import { shouldAutofocusInput } from '../utils/device'

interface DuetClueBarProps {
  currentPlayer: Player
  currentClue: DuetClue | null
  spymasterView: boolean
  suddenDeath: boolean
  gameOver: boolean
  won: boolean
  assassinHit: boolean
  agentsFound: number
  tokensRemaining: number
  onSubmitClue: (word: string, count: number) => void
  onEndTurn: () => void
  onNewGame: () => void
}

export function DuetClueBar({
  currentPlayer,
  currentClue,
  spymasterView,
  suddenDeath,
  gameOver,
  won,
  assassinHit,
  agentsFound,
  tokensRemaining,
  onSubmitClue,
  onEndTurn,
  onNewGame,
}: DuetClueBarProps) {
  const [clueWord, setClueWord] = useState('')
  const [clueCount, setClueCount] = useState('1')

  const playerLabel = currentPlayer === 'p1' ? 'PLAYER 1' : 'PLAYER 2'

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    const count = parseInt(clueCount, 10)
    if (!clueWord.trim() || isNaN(count) || count < 0) return
    onSubmitClue(clueWord.trim(), count)
    setClueWord('')
    setClueCount('1')
  }

  if (gameOver) {
    return (
      <div className="clue-bar clue-bar--duet clue-bar--gameover">
        <p className="clue-bar__status">
          {won
            ? `ALL 15 AGENTS FOUND — YOU WIN!`
            : assassinHit
              ? 'ASSASSIN HIT — YOU LOSE!'
              : suddenDeath
                ? 'SUDDEN DEATH FAILED — YOU LOSE!'
                : 'GAME OVER'}
        </p>
        <button type="button" className="clue-bar__new-game" onClick={onNewGame}>
          NEW GAME
        </button>
      </div>
    )
  }

  const showClueForm =
    spymasterView && !currentClue

  const showCurrentClue = currentClue !== null

  return (
    <div className={`clue-bar clue-bar--duet ${suddenDeath ? 'clue-bar--sudden-death' : ''}`}>
      {suddenDeath && (
        <p className="clue-bar__sudden-death-banner">⚡ SUDDEN DEATH — NO MISTAKES ALLOWED</p>
      )}

      {showClueForm ? (
        <form className="clue-bar__form" onSubmit={handleSubmit}>
          <span className="clue-bar__label">{playerLabel} — GIVE CLUE</span>
          <input
            type="text"
            className="clue-bar__input clue-bar__input--word"
            placeholder="CLUE"
            value={clueWord}
            onChange={(e) => setClueWord(e.target.value)}
            autoFocus={shouldAutofocusInput()}
          />
          <input
            type="number"
            className="clue-bar__input clue-bar__input--count"
            min={0}
            max={9}
            value={clueCount}
            onChange={(e) => setClueCount(e.target.value)}
          />
          <button type="submit" className="clue-bar__submit clue-bar__submit--duet">
            GIVE CLUE
          </button>
        </form>
      ) : showCurrentClue ? (
        <div className="clue-bar__display">
          <span className="clue-bar__clue-text">
            {currentClue.word} {currentClue.count === 0 ? '∞' : currentClue.count}
          </span>
          <button type="button" className="clue-bar__end-turn" onClick={onEndTurn}>
            STOP &amp; TAKE TOKEN
          </button>
        </div>
      ) : (
        <p className="clue-bar__status">
          {playerLabel}&apos;S TURN — {agentsFound}/15 agents · {tokensRemaining} tokens left
          {!currentClue && !spymasterView && (
            <span className="clue-bar__hint"> — View your key before giving a clue</span>
          )}
        </p>
      )}
    </div>
  )
}
