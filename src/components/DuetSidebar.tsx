import type { Player } from '../types'
import { DUET_AGENTS, DUET_TOKENS } from '../utils/duetGameLogic'

interface DuetSidebarProps {
  player: Player
  agentsFound: number
  p1AgentsLeft: number
  p2AgentsLeft: number
  tokensRemaining: number
  isActive: boolean
  spymasterView: boolean
  canViewKey: boolean
  suddenDeath: boolean
  gameOver: boolean
  onToggleSpymasterView: () => void
}

export function DuetSidebar({
  player,
  agentsFound,
  p1AgentsLeft,
  p2AgentsLeft,
  tokensRemaining,
  isActive,
  spymasterView,
  canViewKey,
  suddenDeath,
  gameOver,
  onToggleSpymasterView,
}: DuetSidebarProps) {
  const label = player === 'p1' ? 'PLAYER 1' : 'PLAYER 2'
  const agentsLeft = DUET_AGENTS - agentsFound

  return (
    <aside
      className={`duet-sidebar ${isActive ? 'duet-sidebar--active' : ''} ${suddenDeath ? 'duet-sidebar--sudden-death' : ''}`}
    >
      <div className="duet-sidebar__panel">
        <h3 className="duet-sidebar__heading">{label} — YOUR KEY</h3>
        <button
          type="button"
          className={`duet-sidebar__btn ${spymasterView ? 'duet-sidebar__btn--active' : ''}`}
          onClick={onToggleSpymasterView}
          disabled={gameOver || !canViewKey}
        >
          {spymasterView ? 'HIDE KEY' : 'VIEW MY KEY'}
        </button>
        {isActive && !gameOver && (
          <div className="duet-sidebar__turn-badge">GIVING CLUE</div>
        )}
      </div>

      <div className="duet-sidebar__key-counts">
        <div className="duet-sidebar__key-count duet-sidebar__key-count--p1">
          <span className="duet-sidebar__key-count-value">{p1AgentsLeft}</span>
          <span className="duet-sidebar__key-count-label">P1 KEY</span>
        </div>
        <div className="duet-sidebar__key-count duet-sidebar__key-count--p2">
          <span className="duet-sidebar__key-count-value">{p2AgentsLeft}</span>
          <span className="duet-sidebar__key-count-label">P2 KEY</span>
        </div>
      </div>

      <div className="duet-sidebar__stats">
        <div className="duet-sidebar__stat">
          <span className="duet-sidebar__stat-value">{agentsLeft}</span>
          <span className="duet-sidebar__stat-label">TEAM AGENTS LEFT</span>
        </div>
        <div className="duet-sidebar__stat">
          <span className="duet-sidebar__stat-value">{tokensRemaining}</span>
          <span className="duet-sidebar__stat-label">TOKENS LEFT</span>
        </div>
      </div>

      <div className="duet-sidebar__tokens">
        <span className="duet-sidebar__tokens-label">TIME TOKENS</span>
        <div className="duet-sidebar__token-row">
          {Array.from({ length: DUET_TOKENS }).map((_, i) => (
            <div
              key={i}
              className={`duet-sidebar__token ${i >= tokensRemaining ? 'duet-sidebar__token--used' : ''}`}
            />
          ))}
        </div>
      </div>

      {suddenDeath && (
        <div className="duet-sidebar__sudden-death">SUDDEN DEATH</div>
      )}
    </aside>
  )
}
