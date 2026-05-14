# Minesweeper

A responsive browser-based Minesweeper game built with vanilla JavaScript, HTML, and CSS.

## Features

- Multiple difficulty modes
- Recursive flood-fill reveal system
- Flag and question mark mechanics
- Best time tracking
- Local storage statistics
- First-click safe generation
- Responsive layout
- Mobile-friendly controls

## Technologies

- HTML5
- CSS3
- JavaScript (Vanilla)

## How It Works

The game dynamically generates a board based on the selected difficulty.

Bombs are generated after the first click to guarantee a safe starting position.

The reveal system uses recursive area expansion to uncover nearby empty cells.

Statistics and best times are stored locally using localStorage.

## Controls

### Desktop
- Left click → Reveal cell
- Right click → Place flag/question mark

### Mobile
- Tap → Reveal cell
- Long press → Place flag

## Difficulties

| Difficulty | Grid Size | Bombs |
|------------|-----------|-------|
| Easy       | 8x9       | 10    |
| Normal     | 10x12     | 20    |
| Hard       | 12x14     | 30    |
| Expert     | 13x15     | 40    |

## Author

Made by Moad AIT IDIR