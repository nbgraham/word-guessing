import { AnswerService, StaticAnswerService } from "./answer-service";
import { VersionKey } from "../utilities/types";
import { wordBankService } from "./word-bank-service";
import { dictionaryApi } from "./word-service";

const answerServices: Record<VersionKey, AnswerService> = {
  1: new StaticAnswerService(1, dictionaryApi, wordBankService),
};

export function getAnswerService(version: VersionKey = 1) {
  return answerServices[version];
}
