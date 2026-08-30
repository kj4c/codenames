import { useState } from 'react'
import { SetupScreen } from './components/SetupScreen'
import { GameBoard } from './components/GameBoard'
import { DuetGameBoard } from './components/DuetGameBoard'
import { createGame } from './utils/gameLogic'
import { createDuetGame } from './utils/duetGameLogic'
import type { AnyGameState, GameMode } from './types'
import './App.css'

function App() {
  const [mode, setMode] = useState<GameMode>('standard')
  const [gameState, setGameState] = useState<AnyGameState | null>(null)
  const [savedWords, setSavedWords] = useState<string[]>([])

  function handleStartStandard(words: string[]) {
    setMode('standard')
    setSavedWords(words)
    setGameState(createGame(words))
  }

  function handleStartDuet(words: string[]) {
    setMode('duet')
    setSavedWords(words)
    setGameState(createDuetGame(words))
  }

  function handleNewGame(words: string[]) {
    setSavedWords(words)
    setGameState(null)
  }

  if (!gameState) {
    return (
      <SetupScreen
        mode={mode}
        onModeChange={setMode}
        initialWords={savedWords}
        onStartStandard={handleStartStandard}
        onStartDuet={handleStartDuet}
      />
    )
  }

  if (gameState.mode === 'duet') {
    return (
      <DuetGameBoard
        initialState={gameState}
        words={savedWords}
        onNewGame={handleNewGame}
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
