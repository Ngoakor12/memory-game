const jsdom = require("jsdom");
const fs = require("fs");
const html = fs.readFileSync("index.html", "utf8");
const { JSDOM } = jsdom;
const { document } = new JSDOM(html, { runScripts: "dangerously" }).window;
global.document = document;
const {
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
} = require("../src/memory-game");

describe("Memory game:", () => {
  beforeEach(() => {
    cards[0].addEventListener("click", flipCard);
    cards[0].addEventListener("click", timer);
    cards[0].addEventListener("click", updateCardFlips);
    fourByFourButton.addEventListener("click", setGridSize);
  });

  afterEach(() => {
    cards[0].removeEventListener("click", flipCard);
    cards[0].removeEventListener("click", timer);
    cards[0].removeEventListener("click", updateCardFlips);
    fourByFourButton.removeEventListener("click", setGridSize);
  });

  it("checks if the cardImages are the right size", () => {
    expect(cardImages.length).toEqual(16);
  });
  it("checks if the cardImages are pairs of each other", () => {
    // change cardImages to have unique images
    expect([...new Set(cardImages)].length).toEqual(8);
  });
  it("checks if the card changes when clicked", () => {
    cards[0].click();
    expect(cards[0].style.background).toBe("none");
  });
  it("checks the grid size modal before and after fourByFour button is clicked", () => {
    fourByFourButton.click();
    expect(gridModalStart.style.visibility).toBe("hidden");
  });
  it("checks if the timer changes after button is clicked", () => {
    cards[0].click();
    expect(seconds.innerHTML).not.toBe("0");
  });
  it("checks if the card flips change when button is clicked", () => {
    cards[0].click();
    expect(numberOfFlips.innerHTML).not.toBe("0");
  });
});
