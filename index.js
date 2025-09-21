let deckId = null;
let newCards = []

function handleClick() {
  fetch('https://apis.scrimba.com/deckofcards/api/deck/new/shuffle/')
    .then(res => res.json())
    .then(data => {
      console.log(data)
      deckId = data.deck_id;
      console.log('Saved deck ID:', deckId)
    })
}

function handleDraw() {
  fetch(`https://apis.scrimba.com/deckofcards/api/deck/${deckId}/draw/?count=2`)
    .then(res => res.json())
    .then(data => {
      console.log(data)
      newCards = data.cards
      console.log('Drew cards:', newCards)

      // Display the card images
      const cardsDiv = document.getElementById('cards')
      let cardsHTML = ''

      newCards.forEach(card => {
        cardsHTML += `<img src="${card.image}" alt="${card.value} of ${card.suit}"
        class="card">`
      })
      cardsDiv.innerHTML = cardsHTML
    })
}

document.getElementById('new-deck').addEventListener('click', handleClick)
document.getElementById('draw-cards').addEventListener('click', handleDraw)

