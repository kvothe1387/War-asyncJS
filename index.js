let deckId = null;
let newCards = [];
const header = document.getElementById("header");

function handleClick() {
  fetch('https://apis.scrimba.com/deckofcards/api/deck/new/shuffle/')
    .then(res => res.json())
    .then(data => {
      console.log(data)
      deckId = data.deck_id;
      updateRemainingCards(data.remaining)

      // Ensure draw button is enabled for new deck
      const drawBtn = document.getElementById("draw-cards")
      if (drawBtn) {
        drawBtn.disabled = false
        drawBtn.classList.remove("disabled")
        drawBtn.textContent = "Draw"
      }
    })
}

function determineWinner(card1, card2) {
  const cardValues = {
    "2": 2, "3": 3, "4": 4, "5": 5, "6": 6, "7": 7, "8": 8, "9": 9, "10": 10,
    "JACK": 11, "QUEEN": 12, "KING": 13, "ACE": 14  // Updated to match API format
  }

  // Get the numeric values for both cards
  const card1Score = cardValues[card1.value]
  const card2Score = cardValues[card2.value]

  // Compare the scores and determine the winner
  if (card1Score > card2Score) {
    console.log(`Card 1 wins (${card1.value} beats ${card2.value})`)
    return 'Computer wins!' // Card 1 = Computer
  } else if (card2Score > card1Score) {
    console.log(`Card 2 wins! (${card2.value} beats ${card1.value})`)
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

function handleDraw() {
  fetch(`https://apis.scrimba.com/deckofcards/api/deck/${deckId}/draw/?count=2`)
    .then(res => res.json())
    .then(data => {
      console.log(data)
      newCards = data.cards
      console.log('Drew cards:', newCards)

      // Get all card slot elements
      const cardSlots = document.querySelectorAll('.card-slot')

      // Place cards in slots
      if (newCards[0] && cardSlots[0]) {
        cardSlots[0].innerHTML = `<img src="${newCards[0].image}" alt="${newCards[0].value} of ${newCards[0].suit}" class="card">`
      }
      if (newCards[1] && cardSlots[1]) {
        cardSlots[1].innerHTML = `<img src="${newCards[1].image}" alt="${newCards[1].value} of ${newCards[1].suit}" class="card">`
      }

      // Determine & display the winner
      const winnerText = determineWinner(data.cards[0], data.cards[1])
      displayWinner(winnerText)

      // Update remaining cards count
      updateRemainingCards(data.remaining)
    })
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

document.getElementById('new-deck').addEventListener('click', handleClick)
document.getElementById('draw-cards').addEventListener('click', handleDraw)

