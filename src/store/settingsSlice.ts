import { createSlice, PayloadAction } from "@reduxjs/toolkit";

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
export default settingsSlice;