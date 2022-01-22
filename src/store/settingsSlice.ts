import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const defaultOnlineAnswerServiceVersion = 3;
const defaultOfflineAnswerServiceVersion = 2;

const settingsSlice = createSlice({
  name: "settings",
  initialState: {
    guessesMustBeValidWords: navigator.onLine,
    playOffline: !navigator.onLine,
    answerServiceVersion: navigator.onLine
      ? defaultOnlineAnswerServiceVersion
      : defaultOfflineAnswerServiceVersion,
  },
  reducers: {
    setPlayOffline(state, action: PayloadAction<boolean>) {
      const playOffline = action.payload;
      if (state.playOffline !== playOffline) {
        if (playOffline) {
          state.guessesMustBeValidWords = false;
          state.answerServiceVersion = defaultOfflineAnswerServiceVersion;
        }
      }
      state.playOffline = playOffline;
    },
    setGuessesMustBeValidWords(state, action: PayloadAction<boolean>) {
      state.guessesMustBeValidWords = action.payload;
    },
  },
});
export default settingsSlice;
