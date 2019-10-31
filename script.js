
// Grab all cards
const cardsArray = document.querySelectorAll(".card");
// Grab deck container
const deckEl = document.querySelector(".deck");

// Attach flip on click event listener to check for matches
deckEl.addEventListener("click", event => {
  // Check the thing clicked is a card (requires for checking for all three possible cases that we want to trigger on)
  if (event.target.classList.contains(".card") || event.target.classList.contains(".front") || event.target.classList.contains(".back")) {
    // Make sure there is a common access variable for the card element no matter the thing clicked on.
    if (event.target.classList.contains(".front") || event.target.classList.contains(".back")) {
      const cardEl = event.target.parentElement;
    } else {
      const cardEl = event.target;
    }
    // Check if the card is already face up. return if so, otherwise flip and check for a match
    if (cardEl.classList.contains(".face-up")) {
      return;
    } else {

    }
  }
});

// Function to flip a card

// function to reset the game

// function to start the game

