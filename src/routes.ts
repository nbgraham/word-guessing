import { useMemo } from "react";
import { useParams } from "react-router-dom";
import type { AnswerInfo } from "./utilities/types";

const params = {
  answerServiceVersion: "answerServiceVersion",
  answerId: "answerId",
};

export const routes = {
  home: "/",
  settings: "/settings",
  playNew: "/play/new",
  play: `/play/:${params.answerServiceVersion}/:${params.answerId}`,
  playInstance: (answerInfo: AnswerInfo) =>
    `/play/${answerInfo.answerServiceVersion}/${answerInfo.answerKey}`,
};

export function useAnswerInfoParams(): AnswerInfo {
  const currentParams = useParams();
  const answerObject = useMemo<AnswerInfo>(
    () => ({
      answerServiceVersion: Number(currentParams[params.answerServiceVersion]),
      answerKey: currentParams[params.answerId] || '',
    }),
    [currentParams]
  );
  return answerObject;
}
