import { evaluateGuess } from './guess'

it('reports guess status correctly', () => {
  const result = evaluateGuess('hello', 'peach')
  expect(result).toEqual({
    status: [
      {
        character: 'H',
        inWord: true,
        inPosition: false,
      },
      {
        character: 'E',
        inWord: true,
        inPosition: true,
      },
      {
        character: 'L',
        inWord: false,
        inPosition: false,
      },
      {
        character: 'L',
        inWord: false,
        inPosition: false,
      },
      {
        character: 'O',
        inWord: false,
        inPosition: false,
      },
    ],
    eliminatedLetters: ['L', 'O'],
    foundLetters: ['H', 'E'],
  })
})
