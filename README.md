# Aleatory

> **(adj.)** dependent on chance, luck, or an uncertain outcome

A browser-based Texas Hold'em poker game built with vanilla JavaScript. Test your luck and skill against AI opponents in this sleek, animated poker experience.

![Aleatory Game](https://via.placeholder.com/800x400/1a1a1a/ffffff?text=Aleatory+Poker+Game)

## Features

- **Pure HTML5/CSS3/JavaScript** - No frameworks or dependencies
- **Texas Hold'em Poker** - Classic 5-card community card poker
- **AI Opponents** - Play against intelligent computer players with dynamic betting strategies
- **Beautiful Animations** - Smooth card dealing, chip movements, and background color transitions
- **Responsive Design** - Works on desktop browsers with graceful scaling
- **Hand Evaluation** - Complete poker hand ranking system from high card to royal flush

## How to Play

1. **Start the Game** - Click anywhere on the welcome screen to begin
2. **Place Your Bets** - Use the betting buttons to check, fold, raise, or match
3. **Watch the Action** - AI opponents will make their moves automatically
4. **See the Results** - Best hand wins the pot, and the game continues

### Controls

- **Check/Fold** (Left Button) - Check if no bet is required, or fold your hand
- **Raise/Match** (Right Button) - Raise the bet or match the current highest bet
- **Next** (After Round) - Continue to the next round

## Game Rules

### Hand Rankings (Best to Worst)
1. **Royal Flush** - A, K, Q, J, 10 all same suit
2. **Straight Flush** - Five cards in sequence, same suit
3. **Four of a Kind** - Four cards of the same rank
4. **Full House** - Three of a kind plus a pair
5. **Flush** - Five cards of the same suit
6. **Straight** - Five cards in sequence
7. **Three of a Kind** - Three cards of the same rank
8. **Two Pair** - Two different pairs
9. **One Pair** - Two cards of the same rank
10. **High Card** - Highest single card

### Betting Rounds
- **Pre-flop** - After receiving 2 hole cards
- **The Flop** - After 3 community cards are dealt
- **The Turn** - After the 4th community card
- **The River** - After the 5th community card

## Technical Details

### Architecture
- **Modular JavaScript** - Object-oriented design with Card, Deck, Hand, and Round classes
- **Hand Evaluation Engine** - Sophisticated algorithm for ranking poker hands
- **AI Decision Making** - Dynamic betting based on hand strength and game state
- **Smooth Animations** - CSS transitions and transforms for professional feel

### Browser Support
- Modern browsers with ES5+ support
- Tested on Chrome, Firefox, Safari, and Edge
- Mobile browsers supported but desktop recommended for optimal experience

### File Structure
```
aleatory/
├── index.html      # Main HTML file
├── aleatory.js     # Game logic and mechanics
├── main.css        # Styling and animations
└── README.md       # This file
```

## Getting Started

### Quick Start
1. Clone or download the repository
2. Open `index.html` in your web browser
3. Click to start playing!

### Local Development
```bash
# Clone the repository
git clone https://github.com/yourusername/aleatory.git

# Navigate to the directory
cd aleatory

# Open in browser
open index.html

# Or serve with a local server (recommended)
python -m http.server 8000
# Then visit http://localhost:8000
```

## Game Features in Detail

### Visual Elements
- **Dynamic Background** - Color shifts based on game events
- **Card Animations** - Smooth dealing and flipping effects
- **Chip Movement** - Realistic betting animations
- **Hand Results Display** - Clear winner announcements with hand breakdown

### AI Behavior
- **Adaptive Strategy** - AI adjusts betting based on hand strength and position
- **Realistic Actions** - Check, call, raise, and fold decisions that feel natural
- **Bankroll Management** - AI players manage their money intelligently

### Accessibility
- **Keyboard Navigation** - Full game playable with keyboard
- **Screen Reader Support** - Semantic HTML for assistive technologies
- **Color Contrast** - High contrast design for visibility

## Contributing

Contributions are welcome! Some areas for improvement:

- **Multiplayer Support** - Add network play capabilities
- **Tournament Mode** - Structured tournament brackets
- **Statistics Tracking** - Player performance analytics  
- **Mobile Optimization** - Enhanced touch interface
- **Sound Effects** - Audio feedback for actions
- **Customization** - Themes and card designs

### Development Setup
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Test thoroughly
5. Commit (`git commit -m 'Add amazing feature'`)
6. Push to branch (`git push origin feature/amazing-feature`)
7. Open a Pull Request

## License

This project is open source and available under the [MIT License](LICENSE).

## Credits

Created with ♠️ ♥️ ♦️ ♣️ by the Aleatory team.

**Etymology**: "Aleatory" comes from the Latin word *alea*, meaning "dice" or "game of chance." It perfectly captures the essence of poker - a game where skill meets fortune.

---

*Ready to test your luck? Click to begin your aleatory adventure!*