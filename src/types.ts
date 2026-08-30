export type CardType = 'red' | 'blue' | 'neutral' | 'assassin'
export type Team = 'red' | 'blue'

export interface Card {
  id: number
  word: string
  type: CardType
  revealed: boolean
}

export interface Clue {
  word: string
  count: number
  team: Team
}

export interface GameState {
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
