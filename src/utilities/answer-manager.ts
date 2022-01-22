import { AnswerService, StaticAnswerService } from "./answer-service";
import { VersionKey } from "./types";
import { wordBankService } from "./word-bank-service";
import { DictionaryApi } from "./word-service";

const dictionaryApi = new DictionaryApi();

const answerServices: Record<VersionKey, AnswerService> = {
  1: new StaticAnswerService(1, dictionaryApi, wordBankService),
};

export function getAnswerService(version: VersionKey = 1) {
  return answerServices[version];
}
