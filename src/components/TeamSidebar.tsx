import type { Team } from '../types'

interface TeamSidebarProps {
  team: Team
  remaining: number
  isActive: boolean
  spymasterView: boolean
  canViewKey: boolean
  onToggleSpymasterView: () => void
  gameOver: boolean
  compact?: boolean
}

export function TeamSidebar({
  team,
  remaining,
  isActive,
  spymasterView,
  canViewKey,
  onToggleSpymasterView,
  gameOver,
  compact = false,
}: TeamSidebarProps) {
  const label = team === 'red' ? 'RED' : 'BLUE'

  if (compact) {
    return (
      <aside
        className={`team-sidebar team-sidebar--compact team-sidebar--${team} ${isActive ? 'team-sidebar--compact-active' : ''}`}
      >
        <div className="team-sidebar__compact-top">
          <span className="team-sidebar__compact-label">{label}</span>
          <span className="team-sidebar__count">{remaining}</span>
        </div>
        <button
          type="button"
          className={`team-sidebar__btn team-sidebar__btn--compact ${spymasterView ? 'team-sidebar__btn--active' : ''}`}
          onClick={onToggleSpymasterView}
          disabled={gameOver || !canViewKey}
        >
          {spymasterView ? 'HIDE' : 'KEY'}
        </button>
        {isActive && !gameOver && (
          <div className="team-sidebar__turn-badge">TURN</div>
        )}
      </aside>
    )
  }

  return (
    <aside className={`team-sidebar team-sidebar--full team-sidebar--${team}`}>
      <div className="team-sidebar__panel">
        <h3 className="team-sidebar__heading">SPYMASTERS</h3>
        <button
          type="button"
          className={`team-sidebar__btn ${spymasterView ? 'team-sidebar__btn--active' : ''}`}
          onClick={onToggleSpymasterView}
          disabled={gameOver || !canViewKey}
        >
          {spymasterView ? 'HIDE KEY' : 'VIEW KEY'}
        </button>
      </div>

      <div className="team-sidebar__score">
        <span className="team-sidebar__count">{remaining}</span>
        <div className={`team-sidebar__avatar team-sidebar__avatar--${team}`}>
          <span className="team-sidebar__avatar-icon">🕵️</span>
        </div>
      </div>

      <div
        className={`team-sidebar__panel ${isActive ? 'team-sidebar__panel--active' : ''}`}
      >
        <h3 className="team-sidebar__heading">OPERATIVES</h3>
        <div className="team-sidebar__team-label">{label} TEAM</div>
        {isActive && !gameOver && (
          <div className="team-sidebar__turn-badge">YOUR TURN</div>
        )}
      </div>
    </aside>
  )
}
