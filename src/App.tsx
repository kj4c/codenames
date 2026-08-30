import { useState } from 'react'
import { SetupScreen } from './components/SetupScreen'
import { GameBoard } from './components/GameBoard'
import { createGame } from './utils/gameLogic'
import type { GameState } from './types'
import './App.css'

function App() {
  const [gameState, setGameState] = useState<GameState | null>(null)
  const [savedWords, setSavedWords] = useState<string[]>([])

  function handleStart(words: string[]) {
    setSavedWords(words)
    setGameState(createGame(words))
  }

  function handleNewGame(words: string[]) {
    setSavedWords(words)
    setGameState(null)
  }

  if (!gameState) {
    return (
      <SetupScreen
        initialWords={savedWords}
        onStart={handleStart}
      />
    )
  }

  return (
    <GameBoard
      initialState={gameState}
      onNewGame={handleNewGame}
    />
  )
}

export default App
