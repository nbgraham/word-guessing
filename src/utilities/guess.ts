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

export function chooseBestGuess(options: {
  wordsInfo: WordInfo[];
  pastGuesses: string[];
  eliminatedLetters: string[];
  foundLetters: string[];
}) {
  const { wordsInfo, pastGuesses, eliminatedLetters, foundLetters } = options;

  function contains(list: string[], s: string) {
    return list.some((item) => item.toUpperCase() === s.toUpperCase());
  }

  const guessScores = wordsInfo
    .map((wordInfo) => {
      return {
        word: wordInfo.word,
        letters: wordInfo.word.split(""),
        score: 0,
        frequency: wordInfo.frequency ?? 0,
      };
    })
    .filter((wordInfo) => !contains(pastGuesses, wordInfo.word));

  guessScores.forEach((guess) => {
    foundLetters.forEach((foundLetter) => {
      if (contains(guess.letters, foundLetter)) {
        guess.score++;
      }
    });
    eliminatedLetters.forEach((eliminatedLetter) => {
      if (contains(guess.letters, eliminatedLetter)) {
        guess.score--;
      }
    });
    guess.letters.forEach((guessLetter) => {
      const isNewLetter =
        !contains(foundLetters, guessLetter) &&
        !contains(eliminatedLetters, guessLetter);
      if (isNewLetter) {
        guess.score += 0.5;
      }
    });
  });

  guessScores.sort((a, b) => b.score - a.score || b.frequency - a.frequency);

  return guessScores[0]?.word;
}
