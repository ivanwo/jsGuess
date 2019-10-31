let deck = [0, 0, 1, 1, 2, 2, 3, 3, 4, 4];
let counter = 0;
let time = 0;
let timeSet;

deck.sort(() => Math.random() - 0.5);
function shuffle() {
  deck.sort(() => Math.random() - 0.5);
}

let startEl = document.querySelector(".start");
startEl.addEventListener("click", start);

let resetEl = document.querySelector(".reset");
resetEl.addEventListener("click", reset);

// Grab deck container
const deckEl = document.querySelector(".deck");
// Generate the cards
shuffle();
for (const cardVal of deck) {
  let newCard = document.createElement("div");
  let newFace = document.createElement("div");
  let newBack = document.createElement("div");

  newCard.appendChild(newFace);
  newCard.appendChild(newBack);
  deckEl.appendChild(newCard);

  // Add the face value
  newFace.innerText = `${cardVal}`;
  newBack.innerText = "?";

  // Assign classes to elements;
  newCard.classList.add("card");
  newCard.dataset.activeCard = "false";
  newFace.classList.add("front");
  newBack.classList.add("back", "face-up");
}
// Grab all cards
const cardsArray = document.querySelectorAll(".card");

function game(event) {
  // Check the thing clicked is a card (requires for checking for all three possible cases that we want to trigger on)
  if (
    event.target.classList.contains("card") ||
    event.target.classList.contains("front") ||
    event.target.classList.contains("back")
  ) {
    // Make sure there is a common access variable for the card element no matter the thing clicked on.
    let cardEl;
    if (
      event.target.classList.contains("front") ||
      event.target.classList.contains("back")
    ) {
      cardEl = event.target.parentElement;
    } else {
      cardEl = event.target;
    }
    // Check if the card is already face up. return if so, otherwise flip and check for a match
    if (cardEl.querySelector(".front").classList.contains("face-up")) {
      return;
    } else {
      cardEl.querySelector(".front").classList.toggle("face-up");
      cardEl.querySelector(".back").classList.toggle("face-up");
      // Card flipped up now. Need to check for match.
      for (let checkCard of cardsArray) {
        // console.log(checkCard);
        if (checkCard.dataset.activeCard === "true") {
          if (
            checkCard.querySelector(".front").innerText ===
            cardEl.querySelector(".front").innerText
          ) {
            checkCard.dataset.activeCard = "false";
            counter++;
            // alert(counter);
            if (counter === deck.length / 2) {
              //remove listener from deck
              deckEl.removeEventListener("click", game);
              //stop timer
              clearInterval(timeSet);
            }
            return;
          } else {
            // active card, no match

            deckEl.removeEventListener("click", game);
            setTimeout(() => {
              checkCard.querySelector(".back").classList.toggle("face-up");
              checkCard.querySelector(".front").classList.toggle("face-up");

              cardEl.querySelector(".back").classList.toggle("face-up");
              cardEl.querySelector(".front").classList.toggle("face-up");

              deckEl.addEventListener("click", game);
            }, 1000);

            checkCard.dataset.activeCard = "false";
            return;
          }
        }
      }
      cardEl.dataset.activeCard = "true";
    }
  }
}
// Function to flip a card
// function flipCard(cardEl) {
//   cardEl.children.querySelector(".front").classList.toggle("face-up");
//   cardEl.children.querySelector(".back").classList.toggle("face-up");
// }

// function to reset the game.
// Needs to:
// Reset the win counter,
// Shuffle the deck,
// Flip all the cards face down,
// Reset the timer
// Enable Start button (add event listener to it)

// function to start the game. Needs to add deck event listener and start timer.
function start() {
  // Attach flip on click event listener to check for matches
  deckEl.addEventListener("click", game);
  // begin timer
  timeSet = setInterval(timer, 1000);
  startEl.removeEventListener("click", start);
}
function timer() {
  time++;
  document.querySelector(".screen").innerText = time;
}
function reset(){
    //
}

// Time string function
// Takes in an integer value of seconds
// Returns a string with the format of: hh:mm:ss
function timeString (inputSeconds) {
  let tempNum = inputSeconds;
  const seconds = inputSeconds % 60;
  
  
}