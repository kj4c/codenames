import { useState, useRef, useEffect } from 'react'
import type { DuetGameState } from '../types'
import {
  revealDuetCard,
  submitDuetClue,
  endDuetTurn,
  getDuetRevealResult,
  otherPlayer,
  countUnrevealedAgentsForPlayer,
} from '../utils/duetGameLogic'
import { DuetWordCard, type RevealAnimation } from './DuetWordCard'
import { DuetSidebar } from './DuetSidebar'
import { DuetClueBar } from './DuetClueBar'

interface DuetGameBoardProps {
  initialState: DuetGameState
  words: string[]
  onNewGame: (words: string[]) => void
}

export function DuetGameBoard({
  initialState,
  words,
  onNewGame,
}: DuetGameBoardProps) {
  const [game, setGame] = useState<DuetGameState>(initialState)
  const [spymasterView, setSpymasterView] = useState(false)
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

  function handleToggleSpymasterView() {
    if (game.gameOver || game.currentClue) return
    setSpymasterView((v) => !v)
  }

  function handleSubmitClue(word: string, count: number) {
    setGame((g) => submitDuetClue(g, word, count, g.currentPlayer))
    setSpymasterView(false)
  }

  function handleReveal(cardId: number) {
    const card = game.cards.find((c) => c.id === cardId)
    if (!card || card.revealed) return

    const guessingPlayer = otherPlayer(game.currentPlayer)
    const animResult = getDuetRevealResult(card)
    const animMap: Record<string, RevealAnimation> = {
      correct: 'correct',
      neutral: 'neutral',
      assassin: 'assassin',
    }

    if (animTimer.current) clearTimeout(animTimer.current)
    setRevealAnim({ cardId, result: animMap[animResult] })

    setGame((g) => revealDuetCard(g, cardId, guessingPlayer).state)

    animTimer.current = setTimeout(() => setRevealAnim(null), 1100)
  }

  function handleEndTurn() {
    setGame((g) => endDuetTurn(g))
    setSpymasterView(false)
  }

  const canReveal =
    !game.gameOver && !spymasterView && game.currentClue !== null

  const showAllKeys = game.gameOver
  const viewingPlayer = spymasterView ? game.currentPlayer : null

  const p1AgentsLeft = countUnrevealedAgentsForPlayer(game.cards, 'p1')
  const p2AgentsLeft = countUnrevealedAgentsForPlayer(game.cards, 'p2')

  function handleBackToSetup() {
    onNewGame(words)
  }

  return (
    <div
      className={`game game--duet ${game.suddenDeath ? 'game--sudden-death' : ''} ${game.gameOver ? 'game--ended' : ''}`}
    >
      <header className="game__topbar game__topbar--duet">
        <button type="button" className="game__topbar-btn" onClick={handleBackToSetup}>
          New Game
        </button>
        <span className="game__topbar-title">CODENAMES DUET</span>
        <div className="game__topbar-actions">
          <button type="button" className="game__topbar-btn" onClick={handleBackToSetup}>
            Edit Words
          </button>
        </div>
      </header>

      <DuetClueBar
        currentPlayer={game.currentPlayer}
        currentClue={game.currentClue}
        spymasterView={spymasterView}
        suddenDeath={game.suddenDeath}
        gameOver={game.gameOver}
        won={game.won}
        assassinHit={game.assassinHit}
        agentsFound={game.agentsFound}
        tokensRemaining={game.tokensRemaining}
        onSubmitClue={handleSubmitClue}
        onEndTurn={handleEndTurn}
        onNewGame={handleBackToSetup}
      />

      <main className="game__main game__main--duet">
        <div className="game__mobile-teams game__mobile-teams--duet">
          <div
            className={`duet-mobile-player ${game.currentPlayer === 'p1' ? 'duet-mobile-player--active' : ''}`}
          >
            P1 ({p1AgentsLeft})
          </div>
          <button
            type="button"
            className={`duet-mobile-key-btn ${spymasterView ? 'duet-mobile-key-btn--active' : ''}`}
            onClick={handleToggleSpymasterView}
            disabled={game.gameOver || !!game.currentClue}
          >
            {spymasterView ? 'HIDE KEY' : 'MY KEY'}
          </button>
          <div
            className={`duet-mobile-player ${game.currentPlayer === 'p2' ? 'duet-mobile-player--active' : ''}`}
          >
            P2 ({p2AgentsLeft})
          </div>
        </div>

        <DuetSidebar
          player={game.currentPlayer}
          agentsFound={game.agentsFound}
          p1AgentsLeft={p1AgentsLeft}
          p2AgentsLeft={p2AgentsLeft}
          tokensRemaining={game.tokensRemaining}
          isActive={!game.gameOver}
          spymasterView={spymasterView}
          canViewKey={!game.currentClue && !game.gameOver}
          suddenDeath={game.suddenDeath}
          gameOver={game.gameOver}
          onToggleSpymasterView={handleToggleSpymasterView}
        />

        <div className="game__board">
          <div className="game__grid game__grid--duet">
            {game.cards.map((card) => (
              <DuetWordCard
                key={card.id}
                card={card}
                viewingPlayer={viewingPlayer}
                spymasterView={spymasterView}
                showAllKeys={showAllKeys}
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
      </main>
    </div>
  )
}
