# Set Solitaire

A single-player, offline version of the classic Set card game. This game runs entirely in your browser with no backend or database required.

## Features

- 🎮 **Multiple Game Modes**: Choose from 15+ different Set game variants including Normal, Junior, UltraSet, 4Set, Puzzle modes, and more
- 📱 **Mobile-First Design**: Optimized for mobile devices and touch interfaces
- 🔊 **Sound Effects**: Audio feedback for correct and incorrect sets (toggle in settings)
- ⌨️ **Keyboard Shortcuts**: Fast gameplay with keyboard controls (customizable layouts)
- 🎨 **Customizable Settings**: Sound toggle, board layout (portrait/landscape), card orientation, and keyboard layouts
- 💾 **Offline Play**: No internet connection required
- 📊 **Score Tracking**: Track your score and completion time

## How to Play

1. Find three cards that form a "Set" - each of the four properties (color, shape, shading, number) must be either all the same or all different across the three cards
2. Click or tap cards to select them
3. When you select three cards that form a valid set, they'll be removed and replaced with new cards
4. The game ends when no more sets can be found

## Getting Started

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm start
```

3. Build for production:
```bash
npm build
```

The app will be available at `http://localhost:3000`

## Game Modes

- **Normal**: Classic Set with 4 traits (12 cards)
- **Junior**: Simplified version with 3 traits (9 cards)
- **Set-Chain**: Each set must use 1 card from the previous set
- **UltraSet**: Find 4 cards where pairs form sets with the same additional card
- **Puzzle**: Find all sets on the board before advancing
- **Memory**: Cards dealt face-down, revealed 3 at a time
- **Shuffle**: Cards shuffle after each set
- And many more!

## Settings

Click the **⚙️ Settings** button in the top-right corner to access:

- **Sound Effects**: Toggle sounds on/off
- **Board Layout**: Portrait (3 columns) or Landscape (3 rows)
- **Card Orientation**: Vertical or Horizontal (rotated 90°)
- **Keyboard Layout**: QWERTY, AZERTY, QWERTZ, Dvorak, Colemak, Workman, or Neo

All settings are automatically saved to your browser's local storage.

## Keyboard Shortcuts

- Press the keys shown on the board to select cards (default QWERTY layout)
- Press `Space` or `Escape` to clear your selection
- Change keyboard layout in the settings dialog

## Mobile Installation

To install this app on your mobile device:

1. Build the production version: `npm run build`
2. Deploy the `build` folder to any static hosting service
3. Visit the URL on your mobile device
4. Add to home screen for a native app-like experience

## Technologies

- React 17
- Material-UI 4
- React Spring (animations)
- Local Storage for settings persistence

## License

MIT License - See LICENSE.txt for details

---

Enjoy playing Set Solitaire! 🎉
