import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { getAnswerService } from "../services/answer-manager";
import { unique } from "../utilities/array";
import { evaluateGuess } from "../utilities/guess";
import { WordStatus, AnswerInfo, Loader } from "../utilities/types";

type GameState = {
  answers: Record<
    string,
    {
      guesses: WordStatus[];
      eliminatedLetters: string[];
      foundLetters: string[];
      won?: boolean;
    }
  >;
  newAnswerInfo: Loader<AnswerInfo>;
  answer: Loader<string>;
};

const initialState: GameState = {
  answers: {},
  newAnswerInfo: {
    state: "initial",
  },
  answer: {
    state: "initial",
  },
};

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
  },
  extraReducers: (builder) => {
    builder
      .addCase(pickNewAnswer.pending, (state) => {
        state.newAnswerInfo = {
          state: "loading",
        };
      })
      .addCase(pickNewAnswer.fulfilled, (state, action) => {
        state.newAnswerInfo = {
          state: "done",
          value: action.payload,
        };
      })
      .addCase(pickNewAnswer.rejected, (state, action) => {
        state.newAnswerInfo = {
          state: "error",
          errorMessage: action.error?.message,
        };
      });
    builder
      .addCase(startNewGame.pending, (state) => {
        state.answer = {
          state: "loading",
        };
      })
      .addCase(startNewGame.fulfilled, (state, action) => {
        state.answer = {
          state: "done",
          value: action.payload,
        };
      })
      .addCase(startNewGame.rejected, (state, action) => {
        state.answer = {
          state: "error",
          errorMessage: action.error?.message,
        };
      });
  },
});
export default gameSlice;

export const pickNewAnswer = createAsyncThunk(
  "game/pickNewAnswer",
  async ({ mustBeValidWord }: { mustBeValidWord: boolean }) => {
    const answerService = getAnswerService();
    const answerKey = await answerService.getNewAnswerKey(mustBeValidWord);
    if (!answerKey) throw new Error("Could not get a new answer key");
    const answerInfo: AnswerInfo = {
      answerServiceVersion: answerService.version,
      answerKey: answerKey,
    };
    return answerInfo;
  }
);

export const startNewGame = createAsyncThunk(
  "game/startGame",
  async (answerInfo: AnswerInfo) => {
    const answerService = getAnswerService(answerInfo.answerServiceVersion);
    const answer = await answerService.getAnswer(answerInfo.answerKey);
    if (!answer)
      throw new Error(
        `Could not get matching answer ${JSON.stringify(answerInfo)}`
      );
    return answer;
  }
);
