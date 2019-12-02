let deck = [
  "♣&#xFE0E;",
  "♣&#xFE0E;",
  "♪&#xFE0E;",
  "♪&#xFE0E;",
  "★&#xFE0E;",
  "★&#xFE0E;",
  "♥&#xFE0E;",
  "♥&#xFE0E;",
  "♦&#xFE0E;",
  "♦&#xFE0E;"
];
let flipSound = document.getElementById("fwip");
let downSound = document.getElementById("downSound");
let upSound = document.getElementById("upSound");
let counter = 0;
let time = 0;

let audioOn;
if (localStorage.getItem("audioOn") !== null) {
  audioOn = JSON.parse(localStorage.getItem("audioOn"));
  if (!audioOn) {
    document.querySelector("#audio-on").classList.add("audio-off");
  }
} else {
  audioOn = true;
}
let scoreArray;
let fastestArray;

let timeSet;

// screen.lockOrientation('portrait');

// deck.sort(() => Math.random() - 0.5);
function shuffle() {
  // Old randomizer
  deck.sort(() => Math.random() - 0.5);
  // Just shuffling deck items into random order
  // Setup for loop to go through deck in backwards order
  for (let i = deck.length - 1; i > 0; i--) {
    // Get a random index for the unshuffled deck
    const shuffleIndex = Math.floor(Math.random() * (i + 1));
    // Store the swap item temporarily
    let temp = deck[i];
    // Put the randomly picked item at the end of the unshuffled deck
    deck[i] = deck[shuffleIndex];
    // Put the temporarily stored item in place of the shuffled item
    deck[shuffleIndex] = temp;
  }
}
let menuEl = document.querySelector(".menu");

getScoreList();
// console.log(fastestArray);

function menuFade() {
  menuEl.classList.add("fade");
  setTimeout(_ => (menuEl.style.display = "none"), 2000);
  menuEl.removeEventListener("click", menuFade);
}

let startEl = document.querySelector(".startButton");
startEl.addEventListener("click", start);

let resetEl = document.querySelector(".resetButton");
resetEl.addEventListener("click", reset);

// Add event listeners for clock button sounds
document.querySelector(".clockBack").addEventListener("mousedown", event => {
  if (event.target.classList.contains("pushButton") && audioOn) {
    downSound.play();
  }
});
document.querySelector(".clockBack").addEventListener("mouseup", event => {
  if (event.target.classList.contains("pushButton") && audioOn) {
    upSound.play();
  }
});

// Audio off event listener
document.querySelector("#audio-on").addEventListener("click", (event) => {
  event.stopPropagation();
  event.target.classList.toggle("audio-off");
  audioOn = !audioOn;
  localStorage.setItem("audioOn", JSON.stringify(audioOn));

})

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
  newFace.innerHTML = `${cardVal}`;
  newBack.innerHTML = "?";

  // Assign classes to elements;
  newCard.classList.add("card");
  newCard.dataset.activeCard = "false";
  newFace.classList.add("front");
  newBack.classList.add("back", "face-up");

  // Shuffle function check: Uncommment to default
  // cards face up, and comment previosu 2 lines
  // newFace.classList.add("front", "face-up");
  // newBack.classList.add("back");
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
      flipCard(cardEl);
      // Card flipped up now. Need to check for match.
      for (let checkCard of cardsArray) {
        // console.log(checkCard);
        if (checkCard.dataset.activeCard === "true") {
          if (
            checkCard.querySelector(".front").innerHTML ===
            cardEl.querySelector(".front").innerHTML
          ) {
            checkCard.dataset.activeCard = "false";
            counter++;
            // alert(counter);
            if (counter === deck.length / 2) {
              // * * * WIN CASE * * * //
              //remove listener from deck
              deckEl.removeEventListener("click", game);
              //stop timer
              clearInterval(timeSet);

              // Add current timer time to most recent score list and store score list
              scoreArray.unshift(time);
              // Check if the number of scores > 10, and get rid of 1 if so
              if (scoreArray.length > 10) {
                scoreArray.pop();
              }
              localStorage.setItem("scoreArray", JSON.stringify(scoreArray));

              // Check if the  fastest times list is empty
              if (fastestArray.length === 0) {
                // If it is, add the current time to the list
                fastestArray.push(time);
              } else {
                // Check if current timer is faster than previous top ten times
                for (let i = 0; i < 10; i++) {
                  // If the current timer is faster than the currently element of the list
                  if (time < fastestArray[i]) {
                    // Insert the time
                    fastestArray.splice(i, 0, time);
                    // Check if the score array is bigger than 10
                    if (fastestArray.length > 10) {
                      // Remove the slowest time if so
                      fastestArray.pop();
                    }
                    break;
                  } else if (i === fastestArray.length) {
                    // Check if the index is past the end of the array, if so, add the
                    // time to the array, since the loop will only go up to 10 elements
                    fastestArray.push(time);
                    break;
                  }
                }
              }
              localStorage.setItem(
                "fastestArray",
                JSON.stringify(fastestArray)
              );

              // Set data attribute for score display
              document.body.dataset.scoreDisplay = "recent";
              // Display Score List on Win pop-up
              displayScores();
            }
            return;
          } else {
            // active card, no match

            deckEl.removeEventListener("click", game);
            setTimeout(() => {
              flipCard(checkCard);
              flipCard(cardEl);

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
function flipCard(cardEl) {
  // if (window.matchMedia("(max-width: 600px)")) {
  //   cardEl.classList.toggle("cardFlipPerspective");
  //   setTimeout(() => {
  //     cardEl.querySelector(".front").classList.toggle("face-up");
  //     cardEl.querySelector(".back").classList.toggle("face-up");
  //   }, 500);
  //   setTimeout(() => {
  //     cardEl.classList.toggle("cardFlipPerspective");
  //   }, 1500);
  // } else {

  if (audioOn) {
    setTimeout(_ => {
      flipSound.play();
    }, 30);
  }
  cardEl.querySelector(".front").classList.toggle("face-up");
  cardEl.querySelector(".back").classList.toggle("face-up");
  // }
}

// function to start the game. Needs to add deck event listener and start timer.
function start() {
  // Attach flip on click event listener to check for matches
  deckEl.addEventListener("click", game);
  // begin timer
  timeSet = setInterval(timer, 100);
  startEl.removeEventListener("click", start);
}
function timer() {
  time++;
  document.querySelector(".screen").innerHTML = timeString(time);
}

// reset: function to reset the game.
// Needs to:

function reset() {
  // Remove start button event listener and card event listener just in case
  startEl.removeEventListener("click", start);
  deckEl.removeEventListener("click", game);

  // Get the cards off the screen
  deckEl.classList.toggle("resetDeck");
  // Lock table view
  document.querySelector(".table").classList.toggle("resetTable");

  // console.log("Should have clear animation running");
  // Reset the win counter,
  counter = 0;
  // Shuffle the deck
  shuffle();
  // iterate through the cardsArray to replace the face values
  setTimeout(_ => {
    // console.log("Should have flipped cards");

    for (let i = 0; i < deck.length; i++) {
      const cardEl = cardsArray[i];
      // flip the cards down (toggle face-up class)
      // only flip card if it's facing up
      if (cardEl.querySelector(".front").classList.contains("face-up")) {
        flipCard(cardEl);
      }

      // set a delay to give new values to innerHTML from the reshuffled deck.
      setTimeout(() => {
        cardEl.querySelector(".front").innerHTML = `${deck[i]}`;
      }, 500);
    }
  }, 1000);
  setTimeout(_ => {
    deckEl.classList.toggle("resetDeck");
    // Unlock table view
    document.querySelector(".table").classList.toggle("resetTable");
    // console.log("Should have place on table animation running");
  }, 2000);
  // Reset the timer
  clearInterval(timeSet);
  time = 0;
  document.querySelector(".screen").innerHTML = timeString(time);
  // Enable Start button (add event listener to it)
  setTimeout(() => {
    startEl.addEventListener("click", start);
  }, 3000);
}

// Time string function
// Takes in an integer value of hundreds of milliseconds
// Returns a string with the format of: hh:mm:ss
function timeString(inputTime) {
  let tempNum = inputTime;
  const milliseconds = tempNum % 10;
  tempNum = Math.floor(tempNum / 10);
  const seconds = tempNum % 60;
  //   console.log(tempNum);
  tempNum = Math.floor(tempNum / 60);
  const minutes = tempNum % 60;
  // tempNum = Math.floor(tempNum / 60);
  // const hours = tempNum;

  return `${checkTime(minutes)}:${checkTime(seconds)}.${milliseconds}`;
}

function checkTime(i) {
  if (i < 10) {
    i = "0" + i;
  } // add zero in front of numbers < 10
  return i;
}

// Evenly Spacing Cards Code
// Check how many cards are being displayed
// Odd? Even? What are they divisible by?

// Check how big the screen is.
// What height to width ratio is possible? What looks good?
// We can use max-width breakpoints with the screen size to distribute the cards

// Should we shrink/stretch the cards to compensate?

// Change the menu handling as well?

// Difficulty Settings Code
// User input method

// function to retrive previous win data
function getScoreList() {
  // Handle most recent scores array
  scoreArray = JSON.parse(localStorage.getItem("scoreArray"));
  if (!scoreArray) {
    // If it doesn't exist, create an empty array
    scoreArray = [];
    // And only add the event listener for the menu, keep it visible
    menuEl.addEventListener("click", menuFade);
  } else {
    // Set the data attribute to record that the most recent times are displayed
    document.body.dataset.scoreDisplay = "recent";
    // If there is a score list, display it
    displayScores();
    // and immediately hide the menu
    menuEl.classList.add("fade");
    menuEl.style.display = "none";
  }
  // console.log(scoreArray);

  // Handle fastest scores array
  fastestArray = JSON.parse(localStorage.getItem("fastestArray"));
  if (!fastestArray) {
    // If it doesn't exist create an empty array
    fastestArray = [];
  }
  // Do nothing otherwise, the default display is most recent times
}

// function to display score list
function displayScores() {
  // Create a variable to refer to the array to display on the score list
  let scoreArrayToDisplay;

  // Try to get the current score board
  let scoreBoardEl = document.querySelector(".scoreBoard");
  if (!scoreBoardEl) {
    //  If no board already present, create the div container and attach it to the body
    scoreBoardEl = document.createElement("div");
    document.body.appendChild(scoreBoardEl);
    // Add the scoreboard class to the div container
    scoreBoardEl.classList.add("scoreBoard");
  } else {
    // Otherwise remove the current children
    while (scoreBoardEl.firstChild) {
      scoreBoardEl.firstChild.remove();
    }
  }

  // Create the heading element
  let scoreHeaderEl = document.createElement("h4");
  // Add the heading text depending on the data attribute data-score-display and setup the score array to display
  if (document.body.dataset.scoreDisplay === "recent") {
    scoreHeaderEl.innerHTML = "Most Recent <em>/ (Fastest)</em> Times:";
    scoreArrayToDisplay = scoreArray;
  } else if (document.body.dataset.scoreDisplay === "fastest") {
    scoreHeaderEl.innerHTML = "Fastest <em>/ (Most Recent)</em> Times:";
    scoreArrayToDisplay = fastestArray;
  }
  scoreBoardEl.appendChild(scoreHeaderEl);

  // Add scoreArray times to the board in the order in the array
  for (let i = 0; i < scoreArrayToDisplay.length; i++) {
    if (i < 10) {
      let scorePEl = document.createElement("p");
      scorePEl.innerHTML = `<i>${i + 1})</i> ${timeString(
        scoreArrayToDisplay[i]
      )}`;
      scorePEl.classList.add("scoreP");
      scoreBoardEl.appendChild(scorePEl);
    } else {
      break;
    }
  }

  // Attach the listener to the emphasized text in the heading to swap the list if clicked
  document
    .querySelector(".scoreBoard em")
    .addEventListener("click", swapScoreList);
  // Attach the listener on a delay to the body to clear the score list. The delay prevents a current mouse down from clearing it
  setTimeout(() => {
    document.body.addEventListener("click", clearScoreBoard);
  }, 1000);
}

// Remove the displayed scoreBoard from the page
function clearScoreBoard() {
  let scoreBoardEl = document.querySelector(".scoreBoard");
  document.body.removeEventListener("click", clearScoreBoard);
  scoreBoardEl.remove();
}

// Swap the scoreBoard list on click to the relevent heading text
function swapScoreList(event) {
  // Prevent the click event from propagating and clearing the score list
  event.stopPropagation();

  // Swap the list depending on what is currently displayed according to the data-score-display attribute on the body
  if (document.body.dataset.scoreDisplay === "recent") {
    document.body.dataset.scoreDisplay = "fastest";
    displayScores();
  } else if (document.body.dataset.scoreDisplay === "fastest") {
    document.body.dataset.scoreDisplay = "recent";
    displayScores();
  }
}
