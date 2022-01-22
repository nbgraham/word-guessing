import {
  AnswerService,
  DatamuseApiAnswerService,
  StaticAnswerService,
  WordsApiAnswerService,
} from "./answer-service";
import { VersionKey } from "../utilities/types";
import { wordBankService } from "./word-bank-service";
import { dictionaryApi } from "./word-service";

const answerServices: AnswerService[] = [
  new StaticAnswerService(1, dictionaryApi, wordBankService),
  new WordsApiAnswerService(2),
  new DatamuseApiAnswerService(3),
];

export function getAnswerService(version: VersionKey = 3) {
  const answerService = answerServices.find((s) => s.version === version);
  if (!answerService)
    throw new Error(`Could not find answer service for version: ${version}`);
  return answerService;
}
