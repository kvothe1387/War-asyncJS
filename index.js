let deckId = null;
let newCards = [];
let computerScore = 0
let playerScore = 0
const header = document.getElementById("header");

async function handleClick() {
  try {
    const res = await fetch('https://apis.scrimba.com/deckofcards/api/deck/new/shuffle/');
    const data = await res.json();

    console.log(data);
    deckId = data.deck_id;
    updateRemainingCards(data.remaining);
    resetScores();
    header.textContent = "Game of War";

    const drawButton = document.getElementById("draw-cards");
    if (drawButton) {
      drawButton.disabled = false;
      drawButton.classList.remove("disabled");
      drawButton.textContent = "Draw";
    }
  } catch (error) {
    console.error('Error creating new deck:', error);
    header.textContent = "Error creating deck. Please try again.";
  }
}

function determineWinner(card1, card2) {
  const cardValues = {
    "2": 2, "3": 3, "4": 4, "5": 5, "6": 6, "7": 7, "8": 8, "9": 9, "10": 10,
    "JACK": 11, "QUEEN": 12, "KING": 13, "ACE": 14
  }

  // Get the numeric values for both cards
  const card1Score = cardValues[card1.value]
  const card2Score = cardValues[card2.value]

  // Compare the scores and determine the winner
  if (card1Score > card2Score) {
    computerScore++ // Add point to computer
    updateScoreDisplay() // Update display
    return 'Computer wins!' // Card 1 = Computer
  } else if (card2Score > card1Score) {
    playerScore++ // Add point to player
    updateScoreDisplay() // Update display
    return "You win!" // Card 2 = You
  } else {
    console.log("It's a tie!")
    return "War!" // Tie = War
  }
}

function displayWinner(result) {
  // Check if result element already exists
  let resultElement = document.getElementById("result")

  if (!resultElement) {
    // Create new h2 element
    resultElement = document.createElement("h2")
    resultElement.id = "result"
    // Insert it before the cards container
    const cardsContainer = document.getElementById("cards")
    document.body.insertBefore(resultElement, cardsContainer)
  }
  resultElement.textContent = result
}

function checkForGameEnd(remaining) {
  if (remaining < 2) {
    const header = document.getElementById("header");

    if (computerScore > playerScore) {
      header.textContent = `Computer wins the game! Final score: ${computerScore} - ${playerScore}`;
    } else if (playerScore > computerScore) {
      header.textContent = `You win the game! Final score: ${playerScore} - ${computerScore}`;
    } else {
      header.textContent = `It's a tie game! Final score: ${playerScore} - ${computerScore}`;
    }
  }
}

async function handleDraw() {
  try {
    const res = await fetch(`https://apis.scrimba.com/deckofcards/api/deck/${deckId}/draw/?count=2`);
    const data = await res.json();

    console.log(data);
    newCards = data.cards;
    console.log('Drew cards:', newCards);

    const cardSlots = document.querySelectorAll('.card-slot');

    if (newCards[0] && cardSlots[0]) {
      cardSlots[0].innerHTML = `<img src="${newCards[0].image}" alt="${newCards[0].value} of ${newCards[0].suit}" class="card">`;
    }
    if (newCards[1] && cardSlots[1]) {
      cardSlots[1].innerHTML = `<img src="${newCards[1].image}" alt="${newCards[1].value} of ${newCards[1].suit}" class="card">`;
    }

    updateRemainingCards(data.remaining);

    if (data.remaining >= 2) {
      const winnerText = determineWinner(data.cards[0], data.cards[1]);
      header.textContent = winnerText;
    }

    checkForGameEnd(data.remaining);
  } catch (error) {
    console.error('Error drawing cards:', error);
    header.textContent = "Error drawing cards. Please try again.";
  }
}

function updateRemainingCards(remaining) {
  const remainingElement = document.getElementById('remaining-cards')
  const drawBtn = document.getElementById('draw-cards')

  if (remainingElement) {
    remainingElement.textContent = `Cards remaining: ${remaining}`
  }

  // Handle button state when cards run out
  if (drawBtn) {
    if (remaining < 2) {
      // Disable functionality
      drawBtn.disabled = true
      // Add disabled styling
      drawBtn.classList.add('disabled')
      // Change button text
      drawBtn.textContent = "No Cards Left"
    } else {
      // Enalbe functionality
      drawBtn.disabled = false
      // Remove disabled styling
      drawBtn.classList.remove('disabled')
      // Reset button text
      drawBtn.textContent = "Draw"
    }
  }
}

function updateScoreDisplay() {
  const computerScoreElement = document.getElementById('computer-score')
  const playerScoreElement = document.getElementById('player-score')

  if (computerScoreElement) {
    computerScoreElement.textContent = `Computer Score: ${computerScore}`
  }

  if (playerScoreElement) {
    playerScoreElement.textContent = `Your Score: ${playerScore}`
  }
}

function resetScores() {
  computerScore = 0
  playerScore = 0
  updateScoreDisplay()
}

document.getElementById('new-deck').addEventListener('click', handleClick)
document.getElementById('draw-cards').addEventListener('click', handleDraw)
document.addEventListener('DOMContentLoaded', function () {
  updateScoreDisplay();
});

