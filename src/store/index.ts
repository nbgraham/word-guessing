import { configureStore } from "@reduxjs/toolkit";
import { useDispatch, useSelector, TypedUseSelectorHook } from "react-redux";
import definitionsSlice from "./definitionsSlice";
import gameSlice from "./gameSlice";
import settingsSlice from "./settingsSlice";

const store = configureStore({
  reducer: {
    game: gameSlice.reducer,
    settings: settingsSlice.reducer,
    definition: definitionsSlice.reducer,
  },
});
export default store;

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
