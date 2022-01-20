import { unique } from './array'
import type { WordStatus } from './types'

export function evaluateGuess(guess: string, answer: string) {
  const answerC = answer.toUpperCase()
  const status: WordStatus = guess
    .toUpperCase()
    .split('')
    .map((character, i) => ({
      character,
      inWord: answerC.includes(character),
      inPosition: answerC[i] === character,
    }))
  const eliminatedLetters = unique(
    status.filter((s) => !s.inWord).map((s) => s.character)
  )
  const foundLetters = unique(
    status.filter((s) => s.inWord).map((s) => s.character)
  )
  return { eliminatedLetters, foundLetters, status }
}
