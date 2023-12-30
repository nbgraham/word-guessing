import { chooseBestGuess, evaluateGuess, getWordMatcher } from "./guess";

describe("colors double letters correctly", () => {
  it("colors same letter twice if in answer twice", () => {
    const result = evaluateGuess("erode", "beech");
    expect(result).toEqual({
      status: [
        {
          character: "E",
          inWord: true,
          inPosition: false,
        },
        {
          character: "R",
          inWord: false,
          inPosition: false,
        },
        {
          character: "O",
          inWord: false,
          inPosition: false,
        },
        {
          character: "D",
          inWord: false,
          inPosition: false,
        },
        {
          character: "E",
          inWord: true,
          inPosition: false,
        },
      ],
      eliminatedLetters: ["R", "O", "D"],
      foundLetters: ["E"],
    });
  });
  it("colors same letter twice if in answer twice, correct one green", () => {
    const result = evaluateGuess("sheen", "beech");
    expect(result).toEqual({
      status: [
        {
          character: "S",
          inWord: false,
          inPosition: false,
        },
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
          character: "E",
          inWord: true,
          inPosition: false,
        },
        {
          character: "N",
          inWord: false,
          inPosition: false,
        },
      ],
      eliminatedLetters: ["S", "N"],
      foundLetters: ["H", "E"],
    });
  });
  it("colors same letter only once if in answer once", () => {
    const result = evaluateGuess("erode", "hello");
    expect(result).toEqual({
      status: [
        {
          character: "E",
          inWord: true,
          inPosition: false,
        },
        {
          character: "R",
          inWord: false,
          inPosition: false,
        },
        {
          character: "O",
          inWord: true,
          inPosition: false,
        },
        {
          character: "D",
          inWord: false,
          inPosition: false,
        },
        {
          character: "E",
          inWord: false,
          inPosition: false,
        },
      ],
      eliminatedLetters: ["R", "D"],
      foundLetters: ["E", "O"],
    });
  });
  it("colors only second instance if it is correct", () => {
    const result = evaluateGuess("beech", "dress");
    expect(result).toEqual({
      status: [
        {
          character: "B",
          inWord: false,
          inPosition: false,
        },
        {
          character: "E",
          inWord: false,
          inPosition: false,
        },
        {
          character: "E",
          inWord: true,
          inPosition: true,
        },
        {
          character: "C",
          inWord: false,
          inPosition: false,
        },
        {
          character: "H",
          inWord: false,
          inPosition: false,
        },
      ],
      eliminatedLetters: ["B", "C", "H"],
      foundLetters: ["E"],
    });
  });
});

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
