export type CharacterStatus = {
  character: string;
  inWord: boolean;
  inPosition: boolean;
};
export type WordStatus = CharacterStatus[];
export type AnswerInfo = {
  answerId: number;
  wordBankId: number;
};
type LoaderState = "initial" | "loading" | "done" | "error";
export type Loader<T> = {
  state: LoaderState;
  value?: T;
};
