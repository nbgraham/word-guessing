import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { Loader } from "../utilities/types";
import { getDefinition, WordResult } from "../utilities/word-service";

export const fetchDefinition = createAsyncThunk(
  "definition/fetchDefinition",
  async (word: string) => {
    const results = await getDefinition(word);
    return results;
  }
);

const definitionsSlice = createSlice({
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
export default definitionsSlice;