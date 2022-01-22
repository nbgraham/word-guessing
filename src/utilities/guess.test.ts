import { chooseBestGuess, evaluateGuess } from "./guess";

it("reports guess status correctly", () => {
  const result = evaluateGuess("hello", "peach");
  expect(result).toEqual({
    status: [
      {
        character: "H",
        inWord: true,
        inPosition: false,
      },
      {
        character: "E",
        inWord: true,
        inPosition: true,
      },
      {
        character: "L",
        inWord: false,
        inPosition: false,
      },
      {
        character: "L",
        inWord: false,
        inPosition: false,
      },
      {
        character: "O",
        inWord: false,
        inPosition: false,
      },
    ],
    eliminatedLetters: ["L", "O"],
    foundLetters: ["H", "E"],
  });
});

it("chooses best guess", () => {
  const bestGuess = chooseBestGuess({
    wordsInfo: [
      { word: "weeds" },
      { word: "shape" },
      {
        word: "share",
      },
    ],
    eliminatedLetters: ["w", "d"],
    foundLetters: ["s"],
    pastGuesses: ["shape"],
  });
  expect(bestGuess).toBe("share");
});

it("full example", () => {
  const bestGuess = chooseBestGuess({
    wordsInfo: [
      {
        word: "house",
      },
      {
        word: "point",
      },
      {
        word: "board",
      },
      {
        word: "power",
      },
      {
        word: "force",
      },
      {
        word: "round",
      },
    ],
    eliminatedLetters: ["H", "E", "R", "S", "D", "U", "B"],
    foundLetters: ["A", "O", "T"],
    pastGuesses: ["HEARS", "DOUBT"],
  });
  expect(bestGuess).toBe("point");
});
