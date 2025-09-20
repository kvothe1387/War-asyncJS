let deckId = null;

function handleClick() {
  fetch('https://apis.scrimba.com/deckofcards/api/deck/new/shuffle/')
    .then(res => res.json())
    .then(data => {
      console.log(data)
      deckId = data.deck_id;
      console.log('Saved deck ID:', deckId)
    })
}

document.getElementById('new-deck').addEventListener('click', handleClick)

