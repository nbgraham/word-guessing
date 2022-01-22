import { AnswerService, StaticAnswerService } from "./answer-service";
import { VersionKey } from "./types";
import { WordBankService } from "./word-bank-service";
import { DictionaryApi } from "./word-service";

const wordBankService = new WordBankService(
  () => import("../assets/word-bank.json")
); 
const dictionaryApi = new DictionaryApi();

const answerServices: Record<VersionKey, AnswerService> = {
  1: new StaticAnswerService(1, dictionaryApi, wordBankService),
};
export function getAnswerService(version: VersionKey = 1) {
  return answerServices[version];
}
