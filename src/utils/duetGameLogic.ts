import type { DuetCard, DuetDisplayType, DuetGameState, Player } from '../types'

export const WORD_COUNT = 25
export const DUET_AGENTS = 15
export const DUET_TOKENS = 9
export const DUET_NEUTRAL = 9
export const DUET_P1_ONLY = 6
export const DUET_P2_ONLY = 6
export const DUET_BOTH = 3

function shuffle<T>(array: T[]): T[] {
  const result = [...array]
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[result[i], result[j]] = [result[j], result[i]]
  }
  return result
}

interface DuetAssignment {
  p1Agent: boolean
  p2Agent: boolean
  isAssassin: boolean
}

function generateDuetAssignments(): DuetAssignment[] {
  const indices = shuffle([...Array(WORD_COUNT).keys()])
  const assassinIdx = indices[0]
  const agentIndices = indices.slice(1, 16)
  const p1Only = new Set(agentIndices.slice(0, DUET_P1_ONLY))
  const p2Only = new Set(agentIndices.slice(DUET_P1_ONLY, DUET_P1_ONLY + DUET_P2_ONLY))
  const both = new Set(agentIndices.slice(DUET_P1_ONLY + DUET_P2_ONLY))

  return Array.from({ length: WORD_COUNT }, (_, i) => {
    if (i === assassinIdx) {
      return { p1Agent: false, p2Agent: false, isAssassin: true }
    }
    return {
      p1Agent: p1Only.has(i) || both.has(i),
      p2Agent: p2Only.has(i) || both.has(i),
      isAssassin: false,
    }
  })
}

export function createDuetGame(words: string[]): DuetGameState {
  const shuffledWords = shuffle(words.slice(0, WORD_COUNT))
  const assignments = generateDuetAssignments()
  const startingPlayer: Player = Math.random() < 0.5 ? 'p1' : 'p2'

  const cards: DuetCard[] = shuffledWords.map((word, i) => ({
    id: i,
    word,
    ...assignments[i],
    revealed: false,
  }))

  return {
    mode: 'duet',
    cards,
    currentPlayer: startingPlayer,
    agentsRemaining: DUET_AGENTS,
    agentsFound: 0,
    tokensRemaining: DUET_TOKENS,
    currentClue: null,
    suddenDeath: false,
    gameOver: false,
    won: false,
    assassinHit: false,
  }
}

export function isAnyAgent(card: DuetCard): boolean {
  return card.p1Agent || card.p2Agent
}

export function isAgentForPlayer(card: DuetCard, player: Player): boolean {
  return player === 'p1' ? card.p1Agent : card.p2Agent
}

export function otherPlayer(player: Player): Player {
  return player === 'p1' ? 'p2' : 'p1'
}

export function getCardDisplayType(
  card: DuetCard,
  viewingPlayer: Player | null,
  spymasterView: boolean,
  showAllKeys: boolean
): DuetDisplayType {
  if (showAllKeys || card.revealed) {
    if (card.isAssassin) return 'assassin'
    if (!isAnyAgent(card)) return 'neutral'
    if (card.p1Agent && card.p2Agent) return 'agent-both'
    if (card.p1Agent) return 'agent-p1'
    return 'agent-p2'
  }

  if (!spymasterView || !viewingPlayer) return ''

  // Only reveal this player's own agents — everything else stays anonymous
  if (isAgentForPlayer(card, viewingPlayer)) return 'agent'

  return ''
}

export function countUnrevealedAgentsForPlayer(
  cards: DuetCard[],
  player: Player
): number {
  return cards.filter((c) => !c.revealed && isAgentForPlayer(c, player)).length
}

function consumeToken(
  state: DuetGameState
): Pick<DuetGameState, 'tokensRemaining' | 'suddenDeath'> {
  const tokensRemaining = state.tokensRemaining - 1
  const suddenDeath =
    tokensRemaining === 0 && state.agentsRemaining > 0 ? true : state.suddenDeath
  return { tokensRemaining, suddenDeath }
}

export function revealDuetCard(
  state: DuetGameState,
  cardId: number,
  guessingPlayer: Player
): { state: DuetGameState; result: 'agent' | 'neutral' | 'assassin' } {
  if (state.gameOver) return { state, result: 'agent' }

  const card = state.cards.find((c) => c.id === cardId)
  if (!card || card.revealed) return { state, result: 'agent' }

  if (card.isAssassin) {
    return {
      state: {
        ...state,
        cards: state.cards.map((c) =>
          c.id === cardId ? { ...c, revealed: true } : c
        ),
        gameOver: true,
        won: false,
        assassinHit: true,
        currentClue: null,
      },
      result: 'assassin',
    }
  }

  if (!isAnyAgent(card)) {
    if (state.suddenDeath) {
      return {
        state: {
          ...state,
          cards: state.cards.map((c) =>
            c.id === cardId
              ? { ...c, revealed: true, tokenMarker: guessingPlayer }
              : c
          ),
          gameOver: true,
          won: false,
          currentClue: null,
        },
        result: 'neutral',
      }
    }

    const tokenUpdate = consumeToken(state)
    return {
      state: {
        ...state,
        cards: state.cards.map((c) =>
          c.id === cardId
            ? { ...c, revealed: true, tokenMarker: guessingPlayer }
            : c
        ),
        ...tokenUpdate,
        currentPlayer: otherPlayer(state.currentPlayer),
        currentClue: null,
      },
      result: 'neutral',
    }
  }

  const agentsRemaining = state.agentsRemaining - 1
  const agentsFound = state.agentsFound + 1
  const won = agentsRemaining === 0

  return {
    state: {
      ...state,
      cards: state.cards.map((c) =>
        c.id === cardId ? { ...c, revealed: true } : c
      ),
      agentsRemaining,
      agentsFound,
      gameOver: won,
      won,
      currentClue: won ? null : state.currentClue,
    },
    result: 'agent',
  }
}

export function submitDuetClue(
  state: DuetGameState,
  word: string,
  count: number,
  player: Player
): DuetGameState {
  return {
    ...state,
    currentClue: { word: word.trim().toUpperCase(), count, player },
  }
}

export function endDuetTurn(state: DuetGameState): DuetGameState {
  if (state.gameOver) return state

  const tokenUpdate = consumeToken(state)

  return {
    ...state,
    ...tokenUpdate,
    currentPlayer: otherPlayer(state.currentPlayer),
    currentClue: null,
  }
}

export function parseWords(input: string): string[] {
  return input
    .split(/[\n,;]+/)
    .map((w) => w.trim().toUpperCase())
    .filter((w) => w.length > 0)
}

export function getDuetRevealResult(
  card: DuetCard
): 'correct' | 'neutral' | 'assassin' {
  if (card.isAssassin) return 'assassin'
  if (!isAnyAgent(card)) return 'neutral'
  return 'correct'
}
