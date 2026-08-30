import type { Team } from '../types'

interface TeamSidebarProps {
  team: Team
  remaining: number
  isActive: boolean
  spymasterView: boolean
  canViewKey: boolean
  onToggleSpymasterView: () => void
  gameOver: boolean
}

export function TeamSidebar({
  team,
  remaining,
  isActive,
  spymasterView,
  canViewKey,
  onToggleSpymasterView,
  gameOver,
}: TeamSidebarProps) {
  const label = team === 'red' ? 'RED' : 'BLUE'

  return (
    <aside className={`team-sidebar team-sidebar--${team}`}>
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
          <span className="team-sidebar__avatar-icon">
            {team === 'red' ? '🕵️' : '🕵️'}
          </span>
        </div>
      </div>

      <div className={`team-sidebar__panel ${isActive ? 'team-sidebar__panel--active' : ''}`}>
        <h3 className="team-sidebar__heading">OPERATIVES</h3>
        <div className="team-sidebar__team-label">{label} TEAM</div>
        {isActive && !gameOver && (
          <div className="team-sidebar__turn-badge">YOUR TURN</div>
        )}
      </div>
    </aside>
  )
}
