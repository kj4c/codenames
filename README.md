# Codenames — Custom Words

An in-person Codenames game with custom word lists. No networking required — pass one device around the table.

## Features

- **Custom words** — Add 25 words one at a time or paste a bulk list
- **Red vs Blue teams** — Standard Codenames distribution (9/8 team cards, 7 neutral, 1 assassin)
- **Spymaster view** — Toggle to see the colored key, give a clue, then auto-hide
- **Clue input** — Enter clue word and number at the top bar
- **Operative play** — Tap cards to reveal after a clue is given
- **Turn management** — Wrong guesses and neutral cards end the turn

## Getting Started

```bash
npm install
npm run dev
```

Open the URL shown in your terminal (usually `http://localhost:5173`).

## How to Play

1. **Setup** — Enter exactly 25 custom words, then click **Start Game**
2. **Spymaster** — On your team's turn, click **View Key** on your sidebar to see red/blue/neutral/black cards
3. **Give clue** — Enter your clue word and number, then click **Give Clue** (key hides automatically)
4. **Operatives** — Tap cards on the board to reveal them
5. **End turn** — Click **End Turn** when operatives are done guessing
6. **Win** — Find all your team's words before the other team, and avoid the assassin!

## Tech

- React + TypeScript + Vite
- No backend, no sockets — fully local
