export type GameMode = 'standard' | 'duet'

export type CardType = 'red' | 'blue' | 'neutral' | 'assassin'
export type Team = 'red' | 'blue'

export type Player = 'p1' | 'p2'

export type DuetDisplayType =
  | 'agent-p1'
  | 'agent-p2'
  | 'agent-both'
  | 'agent'
  | 'neutral'
  | 'assassin'
  | ''

export interface Card {
  id: number
  word: string
  type: CardType
  revealed: boolean
}

export interface DuetCard {
  id: number
  word: string
  p1Agent: boolean
  p2Agent: boolean
  isAssassin: boolean
  revealed: boolean
  tokenMarker?: Player
}

export interface Clue {
  word: string
  count: number
  team: Team
}

export interface DuetClue {
  word: string
  count: number
  player: Player
}

export interface GameState {
  mode: 'standard'
  cards: Card[]
  currentTeam: Team
  startingTeam: Team
  redRemaining: number
  blueRemaining: number
  currentClue: Clue | null
  gameOver: boolean
  winner: Team | null
  assassinHit: boolean
}

export interface DuetGameState {
  mode: 'duet'
  cards: DuetCard[]
  currentPlayer: Player
  agentsRemaining: number
  agentsFound: number
  tokensRemaining: number
  currentClue: DuetClue | null
  suddenDeath: boolean
  gameOver: boolean
  won: boolean
  assassinHit: boolean
}

export type AnyGameState = GameState | DuetGameState
