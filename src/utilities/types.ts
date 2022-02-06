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
  isValidAnswer(word: string): Promise<boolean>
}

export type WordBank = {
  source?: string;
  version: number;
  words: string[];
};