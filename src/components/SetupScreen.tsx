import { useState } from 'react'
import type { FormEvent } from 'react'
import { parseWords, WORD_COUNT } from '../utils/gameLogic'

interface SetupScreenProps {
  initialWords?: string[]
  onStart: (words: string[]) => void
}

export function SetupScreen({ initialWords = [], onStart }: SetupScreenProps) {
  const [bulkInput, setBulkInput] = useState('')
  const [words, setWords] = useState<string[]>(initialWords)
  const [newWord, setNewWord] = useState('')
  const [editingWord, setEditingWord] = useState<string | null>(null)
  const [editValue, setEditValue] = useState('')

  const parsed = parseWords(bulkInput)
  const count = words.length
  const ready = count === WORD_COUNT
  const isReplay = initialWords.length > 0

  function addWord(e?: FormEvent) {
    e?.preventDefault()
    const w = newWord.trim().toUpperCase()
    if (!w || words.includes(w) || count >= WORD_COUNT) return
    setWords((prev) => [...prev, w])
    setNewWord('')
  }

  function removeWord(word: string) {
    setWords((prev) => prev.filter((w) => w !== word))
    if (editingWord === word) setEditingWord(null)
  }

  function startEdit(word: string) {
    setEditingWord(word)
    setEditValue(word)
  }

  function saveEdit(e?: FormEvent) {
    e?.preventDefault()
    const w = editValue.trim().toUpperCase()
    if (!w || !editingWord) return
    if (w !== editingWord && words.includes(w)) return
    setWords((prev) => prev.map((x) => (x === editingWord ? w : x)))
    setEditingWord(null)
    setEditValue('')
  }

  function cancelEdit() {
    setEditingWord(null)
    setEditValue('')
  }

  function importBulk() {
    const imported = parseWords(bulkInput)
    const merged = [...new Set([...words, ...imported])].slice(0, WORD_COUNT)
    setWords(merged)
    setBulkInput('')
  }

  function shuffleAndStart() {
    if (!ready) return
    onStart(words)
  }

  function resetWords() {
    setWords([])
    setBulkInput('')
    setNewWord('')
    setEditingWord(null)
    setEditValue('')
  }

  return (
    <div className="setup">
      <header className="setup__header">
        <h1 className="setup__title">CODENAMES</h1>
        <p className="setup__subtitle">
          {isReplay
            ? 'Edit your word list and play again'
            : 'Custom Word Edition — In-Person Play'}
        </p>
      </header>

      <div className="setup__content">
        <section className="setup__section">
          <h2>Add Words</h2>
          <p className="setup__hint">
            Enter exactly {WORD_COUNT} words for the board. Add them one at a time,
            paste a list, or click a word to edit it.
          </p>

          <form className="setup__add-row" onSubmit={addWord}>
            <input
              type="text"
              className="setup__input"
              placeholder="Enter a word and press Enter..."
              value={newWord}
              onChange={(e) => setNewWord(e.target.value)}
              disabled={count >= WORD_COUNT}
              autoFocus={!isReplay}
            />
            <button
              type="submit"
              className="setup__btn setup__btn--add"
              disabled={count >= WORD_COUNT}
            >
              ADD
            </button>
          </form>

          <div className="setup__bulk">
            <textarea
              className="setup__textarea"
              placeholder="Or paste multiple words here (comma or newline separated)..."
              value={bulkInput}
              onChange={(e) => setBulkInput(e.target.value)}
              rows={4}
            />
            {parsed.length > 0 && (
              <button
                type="button"
                className="setup__btn setup__btn--import"
                onClick={importBulk}
              >
                IMPORT {parsed.length} WORD{parsed.length !== 1 ? 'S' : ''}
              </button>
            )}
          </div>
        </section>

        <section className="setup__section setup__word-list-section">
          <div className="setup__count-row">
            <h2>Word List</h2>
            <div className="setup__count-actions">
              {count > 0 && (
                <button
                  type="button"
                  className="setup__btn setup__btn--reset"
                  onClick={resetWords}
                >
                  RESET
                </button>
              )}
              <span
                className={`setup__count ${ready ? 'setup__count--ready' : ''}`}
              >
                {count} / {WORD_COUNT}
              </span>
            </div>
          </div>

          <div className="setup__word-grid">
            {words.map((word) =>
              editingWord === word ? (
                <form
                  key={word}
                  className="setup__word-chip setup__word-chip--editing"
                  onSubmit={saveEdit}
                >
                  <input
                    type="text"
                    className="setup__word-edit-input"
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Escape') cancelEdit()
                    }}
                    autoFocus
                  />
                </form>
              ) : (
                <div key={word} className="setup__word-chip">
                  <button
                    type="button"
                    className="setup__word-label"
                    onClick={() => startEdit(word)}
                    title="Click to edit"
                  >
                    {word}
                  </button>
                  <button
                    type="button"
                    className="setup__word-remove"
                    onClick={() => removeWord(word)}
                    aria-label={`Remove ${word}`}
                  >
                    ×
                  </button>
                </div>
              )
            )}
            {Array.from({ length: WORD_COUNT - count }).map((_, i) => (
              <div
                key={`empty-${i}`}
                className="setup__word-chip setup__word-chip--empty"
              />
            ))}
          </div>
        </section>
      </div>

      <footer className="setup__footer">
        <button
          type="button"
          className="setup__btn setup__btn--start"
          onClick={shuffleAndStart}
          disabled={!ready}
        >
          {isReplay ? 'PLAY AGAIN' : 'START GAME'}
        </button>
      </footer>
    </div>
  )
}
