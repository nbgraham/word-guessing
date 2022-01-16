import type { WordStatus } from "./types";

export function evaluateGuess(guess: string, answer: string) {
  const status: WordStatus = guess
    .toUpperCase()
    .split("")
    .map((character, i) => ({
      character,
      inWord: answer.includes(character),
      inPosition: answer[i] === character,
    }));
  const eliminatedLetters = status
    .filter((s) => !s.inWord)
    .map((s) => s.character);
  const foundLetters = status.filter((s) => s.inWord).map((s) => s.character);
  return { eliminatedLetters, foundLetters, status };
}
