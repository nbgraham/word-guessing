import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { unique } from '../utilities/array'
import { evaluateGuess } from '../utilities/guess'
import { WordStatus, AnswerInfo, Loader } from '../utilities/types'
import { WordBank, isAWord, getWordBank } from '../utilities/word-service'

type GameState = {
  answers: Record<
    string,
    {
      guesses: WordStatus[]
      eliminatedLetters: string[]
      foundLetters: string[]
      won?: boolean
    }
  >
  wordBank?: WordBank
  newAnswerInfo: Loader<AnswerInfo>
  answer?: string
}

const initialState: GameState = {
  answers: {},
  newAnswerInfo: {
    state: 'initial',
  },
}

const gameSlice = createSlice({
  name: 'game',
  initialState,
  reducers: {
    submitGuess(
      state,
      action: PayloadAction<{ guess: string; answer: string }>
    ) {
      const { guess, answer } = action.payload
      const answerState = (state.answers[answer] ??= {
        guesses: [],
        eliminatedLetters: [],
        foundLetters: [],
      })
      if (!answerState)
        throw new Error('No entry in state for the requested answer')

      const { eliminatedLetters, foundLetters, status } = evaluateGuess(
        guess,
        answer
      )

      answerState.won = guess.toUpperCase() === answer.toUpperCase()
      answerState.guesses.push(status)
      answerState.eliminatedLetters = unique([
        ...answerState.eliminatedLetters,
        ...eliminatedLetters,
      ])
      answerState.foundLetters = unique([
        ...answerState.foundLetters,
        ...foundLetters,
      ])
    },
    startGame(state, action: PayloadAction<AnswerInfo>) {
      const { wordBank } = state
      const answerInfo = action.payload
      state.answer =
        answerInfo && wordBank && wordBank.version === answerInfo.wordBankId
          ? wordBank.words[answerInfo.answerId].toUpperCase()
          : undefined
      state.newAnswerInfo = { state: 'initial' }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(pickNewAnswer.fulfilled, (state, action) => {
        state.newAnswerInfo = {
          state: 'done',
          value: action.payload,
        }
      })
      .addCase(pickNewAnswer.rejected, (state, action) => {
        state.newAnswerInfo = {
          state: 'error',
        }
      })

    builder.addCase(fetchWordBank.fulfilled, (state, action) => {
      state.wordBank = action.payload
    })
  },
})
export default gameSlice

export const pickNewAnswer = createAsyncThunk(
  'game/pickNewAnswer',
  async ({
    mustBeValidWord,
    wordBank,
  }: {
    mustBeValidWord: boolean
    wordBank: WordBank
  }) => {
    let tries = 0
    while (tries < 10) {
      tries++
      const words = wordBank.words
      const index = Math.floor(words.length * Math.random())
      const word = words[index]

      if (!mustBeValidWord || (await isAWord(word))) {
        return {
          answerId: index,
          wordBankId: wordBank?.version,
        } as AnswerInfo
      } else {
        console.warn(`"${word}" is not a word. Looking for another word.`)
      }
    }
    throw new Error('Ran out of tries to pick a new answer')
  }
)

export const fetchWordBank = createAsyncThunk('game/fetchWordBank', () =>
  getWordBank()
)
