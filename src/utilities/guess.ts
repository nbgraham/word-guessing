import { datamuseApi } from "../services/datamuse-api";
import { unique } from "./array";
import { WORD_LENGTH } from "./contants";
import type { WordStatus } from "./types";

const DEFAULT_FIRST_GUESS = "REACT";

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

export async function getBestNextGuess(
  guesses: WordStatus[],
  eliminatedLetters: string[],
  foundLetters: string[]
) {
  if (guesses.length === 0) {
    return DEFAULT_FIRST_GUESS;
  }

  const spelledLike = getWordMatcher(guesses);
  const wordsInfo = await getMatchingWordsInfo(spelledLike);

  const pastGuesses = guesses.map((guess) =>
    guess.map((status) => status.character).join("")
  );

  const bestGuess = chooseBestGuess({
    wordsInfo,
    pastGuesses,
    eliminatedLetters,
    foundLetters,
  });

  return bestGuess;
}

async function getMatchingWordsInfo(spelledLike: string): Promise<WordInfo[]> {
  const wordsInfo = await datamuseApi.getWordsInfo({
    spelledLike: spelledLike,
    metadata: {
      frequency: true,
    },
  });
  const wordsWithCorrectLength = wordsInfo.filter(
    (wordInfo) => wordInfo.word.length === WORD_LENGTH
  );
  return wordsWithCorrectLength;
}

export function getWordMatcher(guesses: WordStatus[]) {
  return new Array(WORD_LENGTH)
    .fill(null)
    .map((_, i) => {
      const correctLetter = guesses.find(
        (guess) => guess[i].inPosition && guess[i].inWord
      );
      return correctLetter?.[i].character ?? "?";
    })
    .join("");
}

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

  const maxFreq = Math.max(...guessScores.map((g) => g.frequency));

  guessScores.forEach((guess) => {
    guess.score += Math.min(0.75, guess.frequency / maxFreq);
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

  console.debug('Sorted guess scores', guessScores);
  return guessScores[0]?.word;
}
