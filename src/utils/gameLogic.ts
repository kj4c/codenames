import type { Card, CardType, GameState, Team } from '../types'

export const WORD_COUNT = 25

function shuffle<T>(array: T[]): T[] {
  const result = [...array]
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[result[i], result[j]] = [result[j], result[i]]
  }
  return result
}

function generateKey(startingTeam: Team): CardType[] {
  const firstCount = 9
  const secondCount = 8
  const redCount = startingTeam === 'red' ? firstCount : secondCount
  const blueCount = startingTeam === 'blue' ? firstCount : secondCount

  const key: CardType[] = [
    ...Array(redCount).fill('red' as CardType),
    ...Array(blueCount).fill('blue' as CardType),
    ...Array(7).fill('neutral' as CardType),
    'assassin',
  ]

  return shuffle(key)
}

export function createGame(words: string[]): GameState {
  const startingTeam: Team = Math.random() < 0.5 ? 'red' : 'blue'
  const shuffledWords = shuffle(words.slice(0, WORD_COUNT))
  const key = generateKey(startingTeam)

  const cards: Card[] = shuffledWords.map((word, i) => ({
    id: i,
    word,
    type: key[i],
    revealed: false,
  }))

  const redRemaining = cards.filter((c) => c.type === 'red').length
  const blueRemaining = cards.filter((c) => c.type === 'blue').length

  return {
    mode: 'standard',
    cards,
    currentTeam: startingTeam,
    startingTeam,
    redRemaining,
    blueRemaining,
    currentClue: null,
    gameOver: false,
    winner: null,
    assassinHit: false,
  }
}

export function revealCard(
  state: GameState,
  cardId: number
): { state: GameState; turnEnded: boolean } {
  if (state.gameOver) return { state, turnEnded: false }

  const card = state.cards.find((c) => c.id === cardId)
  if (!card || card.revealed) return { state, turnEnded: false }

  const cards = state.cards.map((c) =>
    c.id === cardId ? { ...c, revealed: true } : c
  )

  let redRemaining = state.redRemaining
  let blueRemaining = state.blueRemaining
  let gameOver = false
  let winner: Team | null = null
  let assassinHit = false
  let turnEnded = false
  let currentTeam = state.currentTeam

  if (card.type === 'assassin') {
    assassinHit = true
    gameOver = true
    winner = state.currentTeam === 'red' ? 'blue' : 'red'
    turnEnded = true
  } else if (card.type === 'red') {
    redRemaining--
    if (redRemaining === 0) {
      gameOver = true
      winner = 'red'
    } else if (state.currentTeam === 'blue') {
      turnEnded = true
    }
  } else if (card.type === 'blue') {
    blueRemaining--
    if (blueRemaining === 0) {
      gameOver = true
      winner = 'blue'
    } else if (state.currentTeam === 'red') {
      turnEnded = true
    }
  } else {
    turnEnded = true
  }

  if (turnEnded && !gameOver) {
    currentTeam = state.currentTeam === 'red' ? 'blue' : 'red'
  }

  return {
    state: {
      ...state,
      cards,
      redRemaining,
      blueRemaining,
      currentTeam,
      gameOver,
      winner,
      assassinHit,
      currentClue: turnEnded && !gameOver ? null : state.currentClue,
    },
    turnEnded,
  }
}

export function submitClue(
  state: GameState,
  word: string,
  count: number,
  team: Team
): GameState {
  return {
    ...state,
    currentClue: { word: word.trim().toUpperCase(), count, team },
  }
}

export function endTurn(state: GameState): GameState {
  if (state.gameOver) return state
  return {
    ...state,
    currentTeam: state.currentTeam === 'red' ? 'blue' : 'red',
    currentClue: null,
  }
}

export function parseWords(input: string): string[] {
  return input
    .split(/[\n,;]+/)
    .map((w) => w.trim().toUpperCase())
    .filter((w) => w.length > 0)
}
