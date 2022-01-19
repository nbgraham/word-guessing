import {
  configureStore,
  createAsyncThunk,
  createSlice,
  PayloadAction,
} from "@reduxjs/toolkit";
import { useDispatch, useSelector, TypedUseSelectorHook } from "react-redux";
import type { AnswerInfo } from "./utilities/types";
import { unique } from "./utilities/array";
import { evaluateGuess } from "./utilities/guess";
import { WordStatus } from "./utilities/types";
import {
  getDefinition,
  isAWord,
  WordBank,
  WordResult,
} from "./utilities/word-service";

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
  wordBank?: WordBank;
  newAnswer?: AnswerInfo;
  answer?: string;
}

const initialState: GameState = {
  answers: {},
};

type LoaderState = "initial" | "loading" | "done" | "error";
type Loader<T> = {
  state: LoaderState;
  value?: T;
};

export const fetchDefinition = createAsyncThunk(
  "definition/fetchDefinition",
  async (word: string) => {
    const results = await getDefinition(word);
    return results;
  }
);

export const definitionsSlice = createSlice({
  name: "definitions",
  initialState: {} as Partial<Record<string, Loader<WordResult[]>>>,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchDefinition.pending, (state, action) => {
      const word = action.meta.arg;
      const wordState = (state[word] ??= { state: "initial" });
      wordState.state = "loading";
    });
    builder.addCase(fetchDefinition.fulfilled, (state, action) => {
      const word = action.meta.arg;
      const results = action.payload;
      const wordState = (state[word] ??= { state: "initial" });
      wordState.state = "done";
      wordState.value = results;
    });
    builder.addCase(fetchDefinition.rejected, (state, action) => {
      const word = action.meta.arg;
      const wordState = (state[word] ??= { state: "initial" });
      wordState.state = "error";
    });
  },
});

const settingsSlice = createSlice({
  name: "settings",
  initialState: {
    guessesMustBeValidWords: false,
    playOffline: !navigator.onLine,
  },
  reducers: {
    setPlayOffline(state, action: PayloadAction<boolean>) {
      state.playOffline = action.payload;
      if (action.payload) {
        state.guessesMustBeValidWords = false;
      }
    },
    setGuessesMustBeValidWords(state, action: PayloadAction<boolean>) {
      state.guessesMustBeValidWords = action.payload;
    },
  },
});
export const settingsActions = settingsSlice.actions;

export const pickNewAnswer = createAsyncThunk(
  "game/pickNewAnswer",
  async ({
    mustBeValidWord,
    wordBank,
  }: {
    mustBeValidWord: boolean;
    wordBank: WordBank;
  }) => {
    let tries = 0;
    while (tries < 10) {
      tries++;
      const words = wordBank.words;
      const index = Math.floor(words.length * Math.random());
      const word = words[index];

      if (!mustBeValidWord || (await isAWord(word))) {
        return {
          answerId: index,
          wordBankId: wordBank?.version,
        } as AnswerInfo;
      } else {
        console.warn(`"${word}" is not a word. Looking for another word.`);
      }
    }
    throw new Error("Ran out of tries to pick a new answer");
  }
);
const gameSlice = createSlice({
  name: "game",
  initialState,
  reducers: {
    submitGuess(
      state,
      action: PayloadAction<{ guess: string; answer: string }>
    ) {
      const { guess, answer } = action.payload;
      const answerState = (state.answers[answer] ??= {
        guesses: [],
        eliminatedLetters: [],
        foundLetters: [],
      });
      if (!answerState)
        throw new Error("No entry in state for the requested answer");

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
    setWordBank(state, action: PayloadAction<WordBank>) {
      state.wordBank = action.payload;
    },
    startGame(state, action: PayloadAction<AnswerInfo>) {
      const { wordBank } = state;
      const answerInfo = action.payload;
      state.answer =
        answerInfo && wordBank && wordBank.version === answerInfo.wordBankId
          ? wordBank.words[answerInfo.answerId].toUpperCase()
          : undefined;
      state.newAnswer = undefined;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(pickNewAnswer.pending, (state) => {
      state.newAnswer = undefined;
    });
    builder.addCase(pickNewAnswer.fulfilled, (state, action) => {
      state.newAnswer = action.payload;
    });
  },
});
export const actions = gameSlice.actions;

export const store = configureStore({
  reducer: {
    game: gameSlice.reducer,
    settings: settingsSlice.reducer,
    definition: definitionsSlice.reducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
