"use strict";
let numFlipsCounter = 0;
let currentMatches = 0;
let winningMatches = 8;
let flippedCards = [];
const cards = [...document.getElementsByClassName("card")];
const loadedImages = themes["adobe"]["cardImages"];
const cardImages = [...loadedImages, ...loadedImages];

const gridModalStart = document.querySelector(".start");
const gridModalEnd = document.querySelector(".end");
const fourByFourButton = document.querySelector(".fourByFour");
const threeByTwoButton = document.querySelector(".threeByTwo");
const twoByTwoButton = document.querySelector(".twoByTwo");
const playAgain = document.querySelector(".playAgain");

fourByFourButton.addEventListener("click", setGridSize);
threeByTwoButton.addEventListener("click", setGridSize);
twoByTwoButton.addEventListener("click", setGridSize);
playAgain.addEventListener("click", restartGame);

const time = document.querySelector(".timer");
const minutes = document.querySelector(".minutes");
const seconds = document.querySelector(".seconds");
const minutesOptional = document.querySelector(".minutes-optional");
const secondsOptional = document.querySelector(".seconds-optional");
const timeEnd = document.querySelector(".time");
let isTimerOn = false;
let stop;

const cardFlips = document.querySelector(".cardFlips");
const numberOfFlips = document.querySelector(".numberOfFlips");
const numberOfFlipsEnd = document.querySelector(".numberOfFlipsEnd");

function updateCardFlips() {
  numFlipsCounter++;
  numberOfFlips.innerHTML = numFlipsCounter;
  numberOfFlipsEnd.innerHTML = numberOfFlips.innerHTML;
}

function timer() {
  if (seconds.innerHTML == 59) {
    minutes.innerHTML++;
    seconds.innerHTML = 0;
  } else {
    if (seconds.innerHTML > 8) {
      secondsOptional.innerHTML = "";
    }
    if (minutesOptional.innerHTML > 8) {
      secondsOptional.innerHTML = "";
    }
    seconds.innerHTML++;
  }
}

function startTimer() {
  stop = setInterval(() => {
    timer();
  }, 1000);
}

function getTime() {
  clearInterval(stop);
  const currentTimer = `${minutesOptional.innerHTML}${minutes.innerHTML}:${secondsOptional.innerHTML}${seconds.innerHTML}`;
  return currentTimer;
}

function setGridSize(event) {
  const gridSize = event.target.innerHTML;
  const numberOfGridCards =
    parseInt(event.target.innerHTML[0]) * parseInt(event.target.innerHTML[2]);
  const numberOfCardsToRemove = 16 - numberOfGridCards;

  // Remove unused cards
  for (let i = numberOfCardsToRemove; i > 0; i--) {
    cards[i].remove();
  }

  // Remove extra images
  loadedImages.length = numberOfGridCards / 2;

  // Add stying according to grid size
  if (gridSize == "3x2") {
    for (let i = 0; i < cards.length; i++) {
      cards[i].classList.add("threeByTwoCard");
    }
    winningMatches = 3;
  } else if (gridSize == "2x2") {
    for (let i = 0; i < cards.length; i++) {
      cards[i].classList.add("twoByTwoCard");
    }
    winningMatches = 2;
  }

  // Remove grid size modal
  gridModalStart.style.visibility = "hidden";

  startGame();
}

function getshuffledImages(cardImages) {
  return cardImages.sort(() => Math.random() - 0.5);
}

function setupCards(cards, cardImages) {
  cards = [...document.querySelectorAll(".card")];
  cardImages = [...loadedImages, ...loadedImages];

  getshuffledImages(cardImages);
  for (let i = 0; i < cards.length; i++) {
    const img = document.createElement("img");
    img.src = `./img/${cardImages[i]}`;
    img.classList.add(`${cardImages[i].split(".")[0]}`);
    // hide card images on start
    img.style.display = "none";

    cards[i].appendChild(img);
  }
  addFlipCardToCards(cards);
}

function addFlipCardToCards(cards) {
  cards.forEach((card) => {
    card.addEventListener("click", flipCard);
  });
}

function removeFlipCardFromCards(cards) {
  cards.forEach((card) => {
    card.removeEventListener("click", flipCard);
  });
}

function flipCard(event) {
  const card = event.target;
  const cardImage = card.childNodes[0];

  // start timer
  if (isTimerOn === false) {
    startTimer();
    isTimerOn = true;
  }

  showCardImage(card, cardImage);

  // increment flip count
  updateCardFlips();

  // prevent double clicks
  card.removeEventListener("click", flipCard);

  flippedCards.push(card);
  if (flippedCards.length === 2) {
    removeFlipCardFromCards(cards);
    setTimeout(() => {
      checkMatch(flippedCards);
      checkGameOver();
      addFlipCardToCards(cards);
      flippedCards = [];
    }, 600);
  }
}

function checkMatch(flippedCards) {
  const firstCard = flippedCards[0];
  const secondCard = flippedCards[1];
  const firstCardImage = firstCard.childNodes[0];
  const secondCardImage = secondCard.childNodes[0];
  const firstCardImageName = firstCardImage.classList[0];
  const secondCardImageName = secondCardImage.classList[0];

  if (firstCardImageName === secondCardImageName) {
    firstCard.removeEventListener("click", flipCard);
    secondCard.removeEventListener("click", flipCard);
    currentMatches++;
  } else {
    hideCardImage(firstCard, firstCardImage);
    hideCardImage(secondCard, secondCardImage);
  }
}

function checkGameOver() {
  if (currentMatches === winningMatches) {
    gridModalEnd.style.visibility = "visible";
    timeEnd.innerHTML = getTime();
    time.style.visibility = "hidden";
    cardFlips.style.visibility = "hidden";
  }
}

function showCardImage(card, image) {
  if (card !== undefined) card.style.background = "none";
  if (image !== undefined) image.style.display = "block";
}

function hideCardImage(card, image) {
  if (card !== undefined) card.style.background = "rgb(22, 22, 22)";
  if (image !== undefined) image.style.display = "none";
}

function startGame() {
  setupCards(cards, cardImages);
  checkGameOver();
}

function restartGame() {
  window.location.reload();
}

module.exports = {
  cards,
  cardImages,
  flipCard,
  fourByFourButton,
  setGridSize,
  gridModalStart,
  seconds,
  timer,
  updateCardFlips,
  numberOfFlips,
};
