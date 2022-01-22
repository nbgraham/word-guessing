import { unique } from "./array";
import type { WordStatus } from "./types";

export function evaluateGuess(guess: string, answer: string) {
  const answerC = answer.toUpperCase();
  const status: WordStatus = guess
    .toUpperCase()
    .split("")
    .map((character, i) => ({
      character,
      inWord: answerC.includes(character),
      inPosition: answerC[i] === character,
    }));
  const eliminatedLetters = unique(
    status.filter((s) => !s.inWord).map((s) => s.character)
  );
  const foundLetters = unique(
    status.filter((s) => s.inWord).map((s) => s.character)
  );
  return { eliminatedLetters, foundLetters, status };
}

type WordInfo = {
  word: string;
  frequency?: number;
};
// TODO: test
export function chooseBestGuess(options: {
  wordsInfo: WordInfo[];
  pastGuesses: string[];
  eliminatedLetters: string[];
  foundLetters: string[];
}) {
  const { wordsInfo, pastGuesses, eliminatedLetters, foundLetters } = options;

  function equalIgnoringCase(a: string, b: string) {
    return a.toUpperCase() === b.toUpperCase();
  }

  const guessWordInfos = wordsInfo
    .map((wordInfo) => {
      return {
        ...wordInfo,
        letters: wordInfo.word.split(""),
      };
    })
    // has not already been guessed
    .filter(
      (wordInfo) =>
        !pastGuesses.some((pastGuess) =>
          equalIgnoringCase(pastGuess, wordInfo.word)
        )
    )
    // does not include any eliminated letters
    .filter((wordInfo) =>
      wordInfo.letters.every(
        (letter) =>
          !eliminatedLetters.some((eliminatedLetter) =>
            equalIgnoringCase(eliminatedLetter, letter)
          )
      )
    )
    // includes all of the found letters
    .filter((wordInfo) =>
      foundLetters.every((foundLetter) =>
        wordInfo.letters.some((letter) =>
          equalIgnoringCase(letter, foundLetter)
        )
      )
    )
    // sort the most frequent words to the beginning
    .sort((a, b) => (b.frequency ?? 0) - (a.frequency ?? 0));

  return guessWordInfos[0]?.word;
}
