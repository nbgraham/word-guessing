import { chooseBestGuess, evaluateGuess, getWordMatcher } from "./guess";

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

describe("chooseBestGuess", () => {
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
});

describe("getWordMatcher", () => {
  it("makes matcher from one guess", () => {
    const matcher = getWordMatcher([
      [
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
    ]);
    expect(matcher).toBe("?E???");
  });

  it("makes matcher from two guess", () => {
    const matcher = getWordMatcher([
      [
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
      [
        {
          character: "R",
          inWord: false,
          inPosition: false,
        },
        {
          character: "E",
          inWord: true,
          inPosition: true,
        },
        {
          character: "A",
          inWord: false,
          inPosition: false,
        },
        {
          character: "C",
          inWord: true,
          inPosition: true,
        },
        {
          character: "T",
          inWord: true,
          inPosition: true,
        },
      ],
    ]);
    expect(matcher).toBe("?E?CT");
  });
});
