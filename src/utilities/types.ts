export type CharacterStatus = {
  character: string;
  inWord: boolean;
  inPosition: boolean;
};
export type WordStatus = CharacterStatus[];

export type VersionKey = number;
export type AnswerInfo = {
  answerKey: string;
  answerServiceVersion: VersionKey;
};

type LoaderState = "initial" | "loading" | "done" | "error";
export type Loader<T> = {
  state: LoaderState;
  value?: T;
  errorMessage?: string;
};

export interface WordValidator {
  isAWord(word: string): Promise<boolean>
}