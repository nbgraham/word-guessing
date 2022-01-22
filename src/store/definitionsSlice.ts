import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { Loader } from "../utilities/types";
import { DictionaryApi, WordResult } from "../services/word-service";

const dictionaryApi = new DictionaryApi();

export const fetchDefinition = createAsyncThunk(
  "definition/fetchDefinition",
  async (word: string) => {
    const results = await dictionaryApi.getDefinition(word);
    return results;
  }
);

const definitionsSlice = createSlice({
  name: "definitions",
  initialState: {} as Partial<Record<string, Loader<WordResult[]>>>,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchDefinition.pending, (state, action) => {
        const word = action.meta.arg;
        state[word] = {
          state: "loading",
        };
      })
      .addCase(fetchDefinition.fulfilled, (state, action) => {
        const word = action.meta.arg;
        const results = action.payload;
        state[word] = {
          state: "done",
          value: results,
        };
      })
      .addCase(fetchDefinition.rejected, (state, action) => {
        const word = action.meta.arg;
        state[word] = {
          state: "error",
        };
      });
  },
});
export default definitionsSlice;
