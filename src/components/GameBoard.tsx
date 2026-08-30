import { useState, useRef, useEffect } from 'react'
import type { GameState, Team } from '../types'
import {
  revealCard,
  submitClue,
  endTurn,
} from '../utils/gameLogic'
import { WordCard, type RevealAnimation } from './WordCard'
import { TeamSidebar } from './TeamSidebar'
import { ClueBar } from './ClueBar'

interface GameBoardProps {
  initialState: GameState
  onNewGame: (words: string[]) => void
}

export function GameBoard({ initialState, onNewGame }: GameBoardProps) {
  const [game, setGame] = useState<GameState>(initialState)
  const [spymasterTeam, setSpymasterTeam] = useState<Team | null>(null)
  const [revealAnim, setRevealAnim] = useState<{
    cardId: number
    result: RevealAnimation
  } | null>(null)
  const animTimer = useRef<ReturnType<typeof setTimeout>>(undefined)

  useEffect(() => {
    return () => {
      if (animTimer.current) clearTimeout(animTimer.current)
    }
  }, [])

  const spymasterView = spymasterTeam !== null

  function handleToggleSpymasterView(team: Team) {
    if (game.gameOver || game.currentTeam !== team || game.currentClue) return
    setSpymasterTeam((prev) => (prev === team ? null : team))
  }

  function handleSubmitClue(word: string, count: number) {
    if (!spymasterTeam) return
    setGame((g) => submitClue(g, word, count, spymasterTeam))
    setSpymasterTeam(null)
  }

  function handleReveal(cardId: number) {
    const card = game.cards.find((c) => c.id === cardId)
    if (!card || card.revealed) return

    let result: RevealAnimation
    if (card.type === 'assassin') result = 'assassin'
    else if (card.type === 'neutral') result = 'neutral'
    else if (card.type === game.currentTeam) result = 'correct'
    else result = 'wrong'

    if (animTimer.current) clearTimeout(animTimer.current)
    setRevealAnim({ cardId, result })

    setGame((g) => revealCard(g, cardId).state)

    animTimer.current = setTimeout(() => setRevealAnim(null), 1100)
  }

  function handleEndTurn() {
    setGame((g) => endTurn(g))
    setSpymasterTeam(null)
  }

  const canReveal =
    !game.gameOver &&
    !spymasterView &&
    game.currentClue !== null &&
    game.currentClue.team === game.currentTeam

  const boardWords = game.cards.map((c) => c.word)

  function handleBackToSetup() {
    onNewGame(boardWords)
  }

  const showFullBoard = spymasterView || game.gameOver

  return (
    <div className={`game game--${game.currentTeam} ${game.gameOver ? 'game--ended' : ''}`}>
      <header className="game__topbar">
        <button type="button" className="game__topbar-btn" onClick={handleBackToSetup}>
          New Game
        </button>
        <span className="game__topbar-title">CODENAMES</span>
        <div className="game__topbar-actions">
          <button type="button" className="game__topbar-btn" onClick={handleBackToSetup}>
            Edit Words
          </button>
        </div>
      </header>

      <ClueBar
        currentTeam={game.currentTeam}
        currentClue={game.currentClue}
        spymasterView={spymasterView}
        activeTeam={spymasterTeam}
        gameOver={game.gameOver}
        winner={game.winner}
        assassinHit={game.assassinHit}
        onSubmitClue={handleSubmitClue}
        onEndTurn={handleEndTurn}
        onNewGame={handleBackToSetup}
      />

      <main className="game__main">
        <TeamSidebar
          team="blue"
          remaining={game.blueRemaining}
          isActive={game.currentTeam === 'blue' && !game.gameOver}
          spymasterView={spymasterTeam === 'blue'}
          canViewKey={
            game.currentTeam === 'blue' && !game.currentClue && !game.gameOver
          }
          onToggleSpymasterView={() => handleToggleSpymasterView('blue')}
          gameOver={game.gameOver}
        />

        <div className="game__board">
          <div className="game__grid">
            {game.cards.map((card) => (
              <WordCard
                key={card.id}
                card={card}
                spymasterView={showFullBoard}
                interactive={canReveal}
                revealAnimation={
                  revealAnim?.cardId === card.id ? revealAnim.result : null
                }
                onReveal={handleReveal}
                disabled={!canReveal}
              />
            ))}
          </div>
        </div>

        <TeamSidebar
          team="red"
          remaining={game.redRemaining}
          isActive={game.currentTeam === 'red' && !game.gameOver}
          spymasterView={spymasterTeam === 'red'}
          canViewKey={
            game.currentTeam === 'red' && !game.currentClue && !game.gameOver
          }
          onToggleSpymasterView={() => handleToggleSpymasterView('red')}
          gameOver={game.gameOver}
        />
      </main>
    </div>
  )
}
