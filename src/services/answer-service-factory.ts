import {
  AnswerService,
  DatamuseApiAnswerService,
  StaticAnswerService,
} from "./answer-service";
import { VersionKey } from "../utilities/types";
import { datamuseApi } from "./datamuse-api";

const answerServices: AnswerService[] = [
  new StaticAnswerService(1, datamuseApi, () => import("../assets/knuth-word-bank.json")),
  new StaticAnswerService(2, datamuseApi, () => import("../assets/words-api-word-bank.json")),
  new DatamuseApiAnswerService(3),
];

export function getAnswerService(version: VersionKey = 3) {
  const answerService = answerServices.find((s) => s.version === version);
  if (!answerService)
    throw new Error(`Could not find answer service for version: ${version}`);
  return answerService;
}
