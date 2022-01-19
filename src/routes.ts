import { useMemo } from "react";
import { useParams } from "react-router-dom";
import type { AnswerInfo } from "./utilities/types";

const params = {
    wordBankId: 'wordBankId',
    answerId: 'answerId'
};

export const routes = {
  instructions: "/instructions",
  settings: "/settings",
  playNew: "/play/new",
  play: `/play/:${params.wordBankId}/:${params.answerId}`,
  playInstance: (answerInfo: AnswerInfo) =>
    `/play/${answerInfo.wordBankId}/${answerInfo.answerId}`,
};

export function useAnswerInfoParams(): AnswerInfo {
  const currentParams = useParams();
  const answerObject = useMemo(
    () => ({
      wordBankId: Number(currentParams[params.wordBankId]),
      answerId: Number(currentParams[params.answerId]),
    }),
    [currentParams]
  );
  return answerObject;
}
