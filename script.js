let deck = [0, 0, 1, 1, 2, 2, 3, 3, 4, 4];

deck.sort(() => Math.random() - 0.5);
function shuffle(){
    deck.sort(() => Math.random() - 0.5);
}

// Grab deck container
const deckEl = document.querySelector(".deck");
// Generate the cards
shuffle();
for (const cardVal of deck) {
  let newCard = document.createElement("div");
  let newFront = document.createElement("div");
  let newBack = document.createElement("div");
  let newFaceVal = document.createElement("p");
  let newBackVal = document.createElement("p");

  newCard.appendChild(newFront);
  newCard.appendChild(newBack);
  newFront.appendChild(newFaceVal);
  newBack.appendChild(newBackVal);
  deckEl.appendChild(newCard);

  // Add the face value
  newFaceVal.innerText = cardVal;
  newBackVal.innerText = "?";

  // Assign classes to elements;
  newCard.classList.add("card");
  newCard.dataset.FaceUp = "false";
  newFront.classList.add("front");
  newBack.classList.add("back", "face-up");

  
}
// Grab all cards
const cardsArray = document.querySelectorAll(".card");


// Attach flip on click event listener to check for matches
deckEl.addEventListener("click", event => {
  // Check the thing clicked is a card (requires for checking for all three possible cases that we want to trigger on)
  if (
    event.target.classList.contains(".card") ||
    event.target.classList.contains(".front") ||
    event.target.classList.contains(".back")
  ) {
    // Make sure there is a common access variable for the card element no matter the thing clicked on.
    if (
      event.target.classList.contains(".front") ||
      event.target.classList.contains(".back")
    ) {
      const cardEl = event.target.parentElement;
    } else {
      const cardEl = event.target;
    }
    // Check if the card is already face up. return if so, otherwise flip and check for a match
    if (cardEl.classList.contains(".face-up")) {
      return;
    } else {
      cardEl.children.querySelector(".front").classList.toggle("face-up");
      cardEl.children.querySelector(".back").classList.toggle("face-up")
    }
  }
});

// Function to flip a card
// function flipCard(cardEl) {
//   cardEl.children.querySelector(".front").classList.toggle("face-up");
//   cardEl.children.querySelector(".back").classList.toggle("face-up");
// }

// function to reset the game

// function to start the game
