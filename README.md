# Gamesk

A collection of Wordle-style word guessing games built with Next.js and Tailwind CSS. Additionally has customized themes for the current games.

## Games

### Korn Wordle
A themed Wordle game featuring song titles from the band Korn.

- Guess 5-letter Korn song titles
- 3 hint options (1 per game):
  - Hard: Album cover image (-5 pts)
  - Medium: Album name (-10 pts)
  - Easy: Reveal a letter (-15 pts)


### Classic Wordle 
A traditional Wordle game with common English words.

- Guess 5-letter English words
- 2 letter reveal hints per game
  - First hint: -10 pts
  - Second hint: -15 pts
- Uses dictionary API to validate words

## Scoring System

- Base score per game: 100 points
- Wrong guess penalty: -15 points each
- Hint penalties: Vary by hint type
- Losing penalty: 0 points minus any hints used (can go negative)
- Hints require enough points to use at start of game, will need to earn hints when you start



## Current Stack

- Next.js 14
- React
- TypeScript
- Tailwind CSS
- Dictionary API for word validation

## Getting Started

1. Clone the repository
2. Install dependencies:
```bash
   npm install
```
3. Run the development server:
```bash
   npm run dev
```
4. Open [http://localhost:3000](http://localhost:3000)

## Author 

Kimberley Gonzalez