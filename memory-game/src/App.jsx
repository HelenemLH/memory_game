import { useState, useEffect } from 'react';
import './App.css';

// this function makes a deck of card pairs (so each symbol appears twice)
function generateDeck() {
  const symbols = ['🍎', '🍌', '🍒', '🍇', '🍉', '🍍']; // just some random fruit emojis
  return [...symbols, ...symbols]; // we duplicate the array to create pairs
}

// function to shuffle the deck
function shuffle(deck) {
  return deck.sort(() => Math.random() - 0.5); // shuffling the cards using random
}

function App() {
  const [deck, setDeck] = useState([]); // state to hold our shuffled deck of cards
  const [flippedCards, setFlippedCards] = useState([]); // state to track which cards are flipped
  const [selectedCards, setSelectedCards] = useState([]); // state to track the two selected cards

  // runs once when the app starts, it creates and shuffles the deck
  useEffect(() => {
    const newDeck = shuffle(generateDeck()); // first, we generate and shuffle the deck
    setDeck(newDeck); // we store the shuffled deck in state
    setFlippedCards(Array(newDeck.length).fill(false)); // all cards start as not flipped
  }, []); // the empty array means this effect only runs once, when the app loads

  // this function is called whenever we click on a card
  const handleCardClick = (index) => {
    if (flippedCards[index] || selectedCards.length === 2) {
      return; // if the card is already flipped or two cards are flipped, do nothing
    }

    const newFlippedCards = [...flippedCards]; // copy the current flipped cards
    newFlippedCards[index] = true; // flip the clicked card
    setFlippedCards(newFlippedCards); // update the state with the flipped card

    const newSelectedCards = [...selectedCards, index]; // add this card to the selected list

    if (newSelectedCards.length === 2) {
      const [firstCardIndex, secondCardIndex] = newSelectedCards; // get the two selected cards
      if (deck[firstCardIndex] !== deck[secondCardIndex]) { // if they don't match
        setTimeout(() => {
          newFlippedCards[firstCardIndex] = false; // hide the first card again
          newFlippedCards[secondCardIndex] = false; // hide the second card
          setFlippedCards([...newFlippedCards]); // update the state to hide the cards again
        }, 1000); // wait 1 second before flipping the cards back
      }
      setSelectedCards([]); // clear the selected cards after comparison
    } else {
      setSelectedCards(newSelectedCards); // update selected cards if there's only one so far
    }
  };

  return (
    <div>
      
      <div className="memory-game">
        {deck.map((card, index) => (
          <div
            className="card"
            key={index}
            onClick={() => handleCardClick(index)} // when we click, it flips the card
          >
            {flippedCards[index] ? card : 'X'} {/* if the card is flipped, show it, otherwise show X */}
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
