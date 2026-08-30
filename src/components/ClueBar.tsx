import { useState, type FormEvent } from 'react'
import type { Clue, Team } from '../types'

interface ClueBarProps {
  currentTeam: Team
  currentClue: Clue | null
  spymasterView: boolean
  activeTeam: Team | null
  gameOver: boolean
  winner: Team | null
  assassinHit: boolean
  onSubmitClue: (word: string, count: number) => void
  onEndTurn: () => void
  onNewGame: () => void
}

export function ClueBar({
  currentTeam,
  currentClue,
  spymasterView,
  activeTeam,
  gameOver,
  winner,
  assassinHit,
  onSubmitClue,
  onEndTurn,
  onNewGame,
}: ClueBarProps) {
  const [clueWord, setClueWord] = useState('')
  const [clueCount, setClueCount] = useState('1')

  const teamLabel = currentTeam === 'red' ? 'RED' : 'BLUE'
  const teamClass = currentTeam

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    const count = parseInt(clueCount, 10)
    if (!clueWord.trim() || isNaN(count) || count < 0) return
    onSubmitClue(clueWord.trim(), count)
    setClueWord('')
    setClueCount('1')
  }

  if (gameOver) {
    const winLabel = winner === 'red' ? 'RED' : 'BLUE'
    const winTeamClass = winner ?? teamClass
    return (
      <div className={`clue-bar clue-bar--${winTeamClass} clue-bar--gameover`}>
        <p className="clue-bar__status">
          {assassinHit
            ? `${teamLabel} TEAM HIT THE ASSASSIN — ${winLabel} TEAM WINS!`
            : `${winLabel} TEAM WINS!`}
        </p>
        <button
          type="button"
          className="clue-bar__new-game"
          onClick={onNewGame}
        >
          NEW GAME
        </button>
      </div>
    )
  }

  const showClueForm =
    spymasterView && activeTeam === currentTeam && !currentClue

  const showCurrentClue = currentClue && currentClue.team === currentTeam

  return (
    <div className={`clue-bar clue-bar--${teamClass}`}>
      {showClueForm ? (
        <form className="clue-bar__form" onSubmit={handleSubmit}>
          <span className="clue-bar__label">{teamLabel} SPYMASTER — GIVE CLUE</span>
          <input
            type="text"
            className="clue-bar__input clue-bar__input--word"
            placeholder="CLUE"
            value={clueWord}
            onChange={(e) => setClueWord(e.target.value)}
            autoFocus
          />
          <input
            type="number"
            className="clue-bar__input clue-bar__input--count"
            min={0}
            max={9}
            value={clueCount}
            onChange={(e) => setClueCount(e.target.value)}
          />
          <button type="submit" className="clue-bar__submit">
            GIVE CLUE
          </button>
        </form>
      ) : showCurrentClue ? (
        <div className="clue-bar__display">
          <span className="clue-bar__clue-text">
            {currentClue.word} {currentClue.count === 0 ? '∞' : currentClue.count}
          </span>
          <button
            type="button"
            className="clue-bar__end-turn"
            onClick={onEndTurn}
          >
            END TURN
          </button>
        </div>
      ) : (
        <p className="clue-bar__status">
          {teamLabel} TEAM&apos;S TURN
          {currentClue && currentClue.team !== currentTeam && (
            <span className="clue-bar__waiting">
              {' '}
              — Waiting for {currentClue.team === 'red' ? 'RED' : 'BLUE'} operatives
            </span>
          )}
        </p>
      )}
    </div>
  )
}
