# Aleatory

**A web-based poker game built with vanilla JavaScript**

> *Aleatory (adj.) - dependent on chance, luck, or an uncertain outcome*

## About

Aleatory is a browser-based Texas Hold'em poker game where you play against computer opponents. The game features dynamic backgrounds, smooth animations, and intelligent AI opponents that adapt their betting strategies based on hand strength and game progression.

## Features

- **Texas Hold'em Poker**: Full implementation with community cards, betting rounds, and hand rankings
- **Intelligent AI**: Computer opponents use sophisticated algorithms to evaluate hands and make betting decisions
- **Dynamic Interface**: Color-shifting backgrounds and smooth card animations
- **Hand Evaluation**: Complete poker hand ranking system from high card to royal flush
- **Responsive Design**: Works across different screen sizes and browsers
- **Real-time Rankings**: Live leaderboard showing player standings and current bids

## How to Play

1. Open `index.html` in your web browser
2. Click anywhere to begin the game
3. Use the bidding buttons to:
   - **Check/Fold**: Pass your turn or exit the hand
   - **Raise/Match**: Increase the bet or match the current highest bid
4. The game progresses through standard poker rounds:
   - **Pre-flop**: Two hole cards dealt to each player
   - **Flop**: Three community cards revealed
   - **Turn**: Fourth community card revealed
   - **River**: Fifth community card revealed
5. Best five-card hand wins the pot

## Game Controls

- **Left Button**: Check (if no bet to match) or Raise
- **Right Button**: Fold or Match (current highest bid)
- The buttons adapt based on the current betting situation

## Technical Details

### Files Structure
- `index.html` - Main game interface
- `aleatory.js` - Core game logic and AI
- `main.css` - Styling and animations

### Key Features in Code

**Hand Evaluation System**: Comprehensive poker hand ranking with over 7,000 possible hand combinations properly ranked.

**AI Strategy**: Computer opponents use dynamic betting strategies based on:
- Hand strength evaluation
- Community card analysis
- Current round (pre-flop, flop, turn, river)
- Pot odds and betting patterns

**Animation System**: Smooth CSS transitions for:
- Card dealing and flipping
- Chip movements to pot
- Background color changes
- UI element fading

## Browser Compatibility

- Modern browsers with CSS3 and ES5 support
- Chrome, Firefox, Safari, Edge
- Mobile browsers supported

## Installation

No installation required! Simply:

1. Download or clone the repository
2. Open `index.html` in any modern web browser
3. Start playing immediately

## Game Rules

Standard Texas Hold'em poker rules apply:
- Each player gets 2 hole cards
- 5 community cards are dealt in stages
- Players make the best 5-card hand possible
- Standard poker hand rankings (Royal Flush beats Straight Flush, etc.)
- Betting rounds occur after each card stage

## Development

The game is built with:
- **Vanilla JavaScript** - No frameworks or dependencies
- **CSS3** - Modern styling with animations and gradients
- **HTML5** - Semantic markup and responsive design

### Customization

You can easily modify:
- Number of AI opponents (currently 2)
- Starting money amounts
- Betting limits
- Animation speeds
- Color schemes

## License

This project is open source. Feel free to use, modify, and distribute as needed.

---

*Ready to test your luck? The cards are waiting...*