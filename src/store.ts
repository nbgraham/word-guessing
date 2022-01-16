import { configureStore, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { useDispatch, useSelector, TypedUseSelectorHook } from "react-redux";
import { unique } from "./utilities/array";
import { evaluateGuess } from "./utilities/guess";
import { WordStatus } from "./utilities/types";
import type { WordBank } from "./utilities/word-service";

export interface GameState {
  answers: Record<
    string,
    {
      guesses: WordStatus[];
      eliminatedLetters: string[];
      foundLetters: string[];
      won?: boolean;
    }
  >;
  settings: {
    guessesMustBeValidWords: boolean;
    playOffline: boolean;
  };
  wordBank?: WordBank;
}

const initialState: GameState = {
  answers: {},
  settings: {
    guessesMustBeValidWords: false,
    playOffline: !navigator.onLine,
  },
};

export const gameSlice = createSlice({
  name: "game",
  initialState,
  reducers: {
    submitGuess: (
      state,
      action: PayloadAction<{ guess: string; answer: string }>
    ) => {
      const { guess, answer } = action.payload;

      // Ensure the answer exists in state, or create it
      state.answers[answer] ??= {
        guesses: [],
        eliminatedLetters: [],
        foundLetters: [],
      };
      const answerState = state.answers[answer];

      const { eliminatedLetters, foundLetters, status } = evaluateGuess(
        guess,
        answer
      );

      answerState.won = guess.toUpperCase() === answer.toUpperCase();
      answerState.guesses.push(status);
      answerState.eliminatedLetters = unique([
        ...answerState.eliminatedLetters,
        ...eliminatedLetters,
      ]);
      answerState.foundLetters = unique([
        ...answerState.foundLetters,
        ...foundLetters,
      ]);
    },
    setPlayOffline(state, action: PayloadAction<boolean>) {
      state.settings.playOffline = action.payload;
      if (action.payload) {
        state.settings.guessesMustBeValidWords = false;
      }
    },
    setGuessesMustBeValidWords(state, action: PayloadAction<boolean>) {
      state.settings.guessesMustBeValidWords = action.payload;
    },
    setWordBank(state, action: PayloadAction<WordBank>) {
      state.wordBank = action.payload;
    },
  },
});

export const actions = gameSlice.actions;

export const store = configureStore({
  reducer: gameSlice.reducer,
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
