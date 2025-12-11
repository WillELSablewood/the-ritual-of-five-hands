/**
 * The Ritual of Five Hands
 * ------------------------
 * Core game logic for the ritual:
 * - Score and round tracking
 * - Random opponent move
 * - Round resolution and feedback
 * - Resetting the ritual
 */

/*State and configuration*/

const choices = ["rock", "paper", "scissors", "lizard", "spock"];
let maxRounds = 10; // will be updated from the round selector

// Game state
let playerScore = 0;
let computerScore = 0;
let currentRound = 0;
let playerName = "";

// Map: what each move beats
const winsAgainst = {
  rock: ["scissors", "lizard"],
  paper: ["rock", "spock"],
  scissors: ["paper", "lizard"],
  lizard: ["paper", "spock"],
  spock: ["rock", "scissors"]
};

/*DOM elements*/

const playerScoreEl = document.getElementById("player-score");
const computerScoreEl = document.getElementById("computer-score");
const currentRoundEl = document.getElementById("current-round");
const maxRoundsEl = document.getElementById("max-rounds");
const roundMessageEl = document.getElementById("round-message");
const summaryMessageEl = document.getElementById("summary-message");
const resetBtn = document.getElementById("reset-btn");
const choiceButtons = document.querySelectorAll(".choice-btn");

// Ritual setup elements
const usernameInput = document.getElementById("username-input");
const usernameError = document.getElementById("username-error");
const roundSelect = document.getElementById("round-select");
const startBtn = document.getElementById("start-btn");

// Initialise max rounds in UI
maxRoundsEl.textContent = maxRounds;

/*Helper functions*/

/*Return a completely random move.*/
function getRandomChoice() {
  const index = Math.floor(Math.random() * choices.length);
  return choices[index];
}

/*The computer always plays randomly.*/
function getComputerChoice() {
  return getRandomChoice();
}

/*Determine the result of a single round.
 * Returns "win", "lose" or "draw".*/
function getRoundResult(playerChoice, computerChoice) {
  if (playerChoice === computerChoice) {
    return "draw";
  }

  if (winsAgainst[playerChoice].includes(computerChoice)) {
    return "win";
  }

  return "lose";
}

/*Update scores in state and DOM.*/
function updateScores(result) {
  if (result === "win") {
    playerScore++;
  } else if (result === "lose") {
    computerScore++;
  }

  playerScoreEl.textContent = playerScore;
  computerScoreEl.textContent = computerScore;
}

/*Increment the round and update the DOM.*/
function updateRound() {
  currentRound++;
  currentRoundEl.textContent = currentRound;
}

/*Check if the ritual has reached the final round.*/
function isGameOver() {
  return currentRound >= maxRounds;
}

/*Show feedback for the current round.*/
function showRoundMessage(playerChoice, computerChoice, result) {
  let text = `${playerName} chose ${playerChoice}. Opponent chose ${computerChoice}. `;

  if (result === "win") {
    text += "You win this round.";
  } else if (result === "lose") {
    text += "You lose this round.";
  } else {
    text += "The round is a draw.";
  }

  roundMessageEl.textContent = text;
}

/*Show the final ritual summary after the last round.*/
function showSummaryMessage() {
  let text = `The ritual is complete, ${playerName}. Final score — ${playerName}: ${playerScore}, Opponent: ${computerScore}. `;

  if (playerScore > computerScore) {
    text += "You emerge from the circle victorious.";
  } else if (playerScore < computerScore) {
    text += "The opponent claims this ritual.";
  } else {
    text += "The ritual ends in perfect balance.";
  }

  summaryMessageEl.textContent = text;
}

/*Enable or disable all choice buttons.*/
function setChoiceButtonsDisabled(disabled) {
  choiceButtons.forEach((button) => {
    button.disabled = disabled;
  });
}

/*Reset game state and UI to initial values,
 * keeping the current playerName and maxRounds.*/
function resetGame() {
  playerScore = 0;
  computerScore = 0;
  currentRound = 0;

  playerScoreEl.textContent = playerScore;
  computerScoreEl.textContent = computerScore;
  currentRoundEl.textContent = currentRound;
  maxRoundsEl.textContent = maxRounds;

  roundMessageEl.textContent = "Click a hand to begin the ritual.";
  summaryMessageEl.textContent = "";

  setChoiceButtonsDisabled(false);
}

/*Event listeners*/

/*Start Ritual button: validate input and prepare the game.*/
startBtn.addEventListener("click", () => {
  usernameError.textContent = "";

  playerName = usernameInput.value.trim();
  const chosenRounds = parseInt(roundSelect.value, 10);

  if (!playerName) {
    usernameError.textContent = "Please enter your name to begin the ritual.";
    return;
  }

  // Update max rounds based on selection
  maxRounds = chosenRounds;
  maxRoundsEl.textContent = maxRounds;

  // Reset scores and rounds for a fresh ritual
  resetGame();

  // Custom starting message
  roundMessageEl.textContent = `${playerName}, invoke your first hand.`;
  summaryMessageEl.textContent = "";

  setChoiceButtonsDisabled(false);
  resetBtn.disabled = false;
});

/*Main click handler: runs when the player chooses a hand.*/
choiceButtons.forEach((button) => {
  button.addEventListener("click", () => {

    // Defensive design: ignore clicks if the ritual is already complete
    if (isGameOver()) {
      return;
    }

    const playerChoice = button.getAttribute("data-choice");
    const computerChoice = getComputerChoice();
    const result = getRoundResult(playerChoice, computerChoice);

    updateScores(result);
    updateRound();
    showRoundMessage(playerChoice, computerChoice, result);

    if (isGameOver()) {
      showSummaryMessage();
      setChoiceButtonsDisabled(true);
    }
  });
});

/* Reset button handler: starts a new ritual with the same
 * player name and ritual length.*/

resetBtn.addEventListener("click", () => {
  resetGame();
  if (playerName) {
    roundMessageEl.textContent = `${playerName}, invoke your first hand.`;
  }
});

/*Initial state*/

// At page load, the ritual cannot start until the user prepares it.
setChoiceButtonsDisabled(true);
resetBtn.disabled = true;