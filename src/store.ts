import { configureStore, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { useDispatch, useSelector, TypedUseSelectorHook } from "react-redux";
import { unique } from "./utilities/array";

export type CharacterStatus = {
  character: string;
  inWord: boolean;
  inPosition: boolean;
};
export type WordStatus = CharacterStatus[];

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
}

const initialState: GameState = {
  answers: {},
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
      state.answers[answer] ??= {
        guesses: [],
        eliminatedLetters: [],
        foundLetters: [],
      };
      const status: WordStatus = guess
        .toUpperCase()
        .split("")
        .map((character, i) => ({
          character,
          inWord: answer.includes(character),
          inPosition: answer[i] === character,
        }));

      state.answers[answer].won = guess.toUpperCase() === answer.toUpperCase();

      const eliminatedLetters = status
        .filter((s) => !s.inWord)
        .map((s) => s.character);
      state.answers[answer].eliminatedLetters = unique([
        ...state.answers[answer].eliminatedLetters,
        ...eliminatedLetters,
      ]);

      const foundLetters = status
        .filter((s) => s.inWord)
        .map((s) => s.character);
      state.answers[answer].foundLetters = unique([
        ...state.answers[answer].foundLetters,
        ...foundLetters,
      ]);

      state.answers[answer].guesses.push(status);
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
