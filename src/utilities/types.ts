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
