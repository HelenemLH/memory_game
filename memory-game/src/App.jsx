import { useState, useEffect } from 'react';
import './App.css';
import Confetti from 'react-confetti';

function generateDeck() {
  const symbols = ['🐡', '🐠', '🐙', '🐬', '🐋', '🦐'];
  return [...symbols, ...symbols]; // duplicates each symbol to create pairs
}

function shuffle(deck) {
  return deck.sort(() => Math.random() - 0.5); // randomly shuffles the deck
}

function App() {
  const [deck, setDeck] = useState([]); // stores the deck of cards
  const [flippedCards, setFlippedCards] = useState([]); // tracks which cards are flipped
  const [selectedCards, setSelectedCards] = useState([]); // stores the indices of selected cards
  const [foundPairs, setFoundPairs] = useState(0); // counts the number of matched pairs
  const [gameWon, setGameWon] = useState(false); // tracks if the game is won
  const [isComparing, setIsComparing] = useState(false); // prevents more clicks during comparison

  // sets up the game when it first loads by generating and shuffling the deck
  useEffect(() => {
    const newDeck = shuffle(generateDeck()); // shuffles a new deck
    setDeck(newDeck); // saves the deck in state
    setFlippedCards(Array(newDeck.length).fill(false)); // sets all cards as face-down
  }, []); // the empty array means this runs only once when the game starts

  // checks if the game is won when all pairs are found
  useEffect(() => {
    if (foundPairs === deck.length / 2 && deck.length > 0) {
      setGameWon(true); // sets gameWon to true if all pairs are found
    }
  }, [foundPairs, deck.length]); // this effect runs every time foundPairs changes

  // called when a card is clicked
  const handleCardClick = (index) => {
    // prevents clicking if the card is already flipped or if two cards are being compared
    if (flippedCards[index] || selectedCards.length === 2 || isComparing) return;

    const newFlippedCards = [...flippedCards]; // creates a copy of the current flipped cards
    newFlippedCards[index] = true; // flips the clicked card
    setFlippedCards(newFlippedCards); // updates the flippedCards state

    const newSelectedCards = [...selectedCards, index]; // adds this card to selectedCards

    // if two cards are selected, we need to compare them
    if (newSelectedCards.length === 2) {
      setIsComparing(true); // stops more clicks during comparison

      const [first, second] = newSelectedCards;
      if (deck[first] === deck[second]) { // if the two cards match
        setFoundPairs(foundPairs + 1); // increments found pairs count
        setSelectedCards([]); // clears the selected cards
        setIsComparing(false); // allows clicks again
      } else { // if the two cards don't match
        setTimeout(() => {
          newFlippedCards[first] = false; // flips the first card back down
          newFlippedCards[second] = false; // flips the second card back down
          setFlippedCards([...newFlippedCards]); // updates the flippedCards state
          setSelectedCards([]); // clears the selected cards
          setIsComparing(false); // allows clicks again after comparison
        }, 1000); // adds a 1-second delay before flipping cards back
      }
    } else {
      setSelectedCards(newSelectedCards); // updates selectedCards if only one card is flipped
    }
  };

  // restarts the game by shuffling a new deck and resetting the state
  const restartGame = () => {
    const newDeck = shuffle(generateDeck()); // shuffles a new deck
    setDeck(newDeck); // sets the new deck
    setFlippedCards(Array(newDeck.length).fill(false)); // resets all cards to face-down
    setFoundPairs(0); // resets found pairs count
    setGameWon(false); // resets gameWon state
    setSelectedCards([]); // clears the selected cards
    setIsComparing(false); // resets the isComparing flag
  };

  return (
    <div>
      <h1 className="game-title">Memory Game</h1> 
      {gameWon && (
        <>
          <Confetti /> 
          <p>Congratulations! You won!</p> 
          <button style={{ marginBottom: '20px' }} onClick={restartGame}>Play Again</button>
  </>
)}
      <div className="memory-game">
        {deck.map((card, index) => (
          <div
            className={`card ${!flippedCards[index] ? 'hidden' : ''}`} // adds 'hidden' class if the card is face-down
            key={index}
            onClick={() => handleCardClick(index)} // flips the card when clicked
          >
            {flippedCards[index] ? card : 'X'} {/* shows the card if flipped, otherwise shows 'X' */}
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
