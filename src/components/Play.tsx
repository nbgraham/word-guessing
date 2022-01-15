import React, {
  useMemo,
} from "react";
import { useAnswer, useNewAnswer } from "../utilities/words";
import { Navigate, useParams } from "react-router-dom";
import { Spinner } from "./Spinner";
import { Game } from "./Game";

export const PlayNew: React.FC = () => {
  const answer = useNewAnswer();
  return answer === undefined ? (
    <div>
      Loading Game <Spinner size={15} />
    </div>
  ) : (
    <Navigate replace to={`/play/${answer.wordBankId}/${answer.answerId}`} />
  );
};

export const Play: React.FC = () => {
  const { wordBankId, answerId } = useParams();
  const answerObject = useMemo(
    () => ({
      wordBankId: Number(wordBankId),
      answerId: Number(answerId),
    }),
    [wordBankId, answerId]
  );
  const answer = useAnswer(answerObject);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 30,
      }}
    >
      {answer && <Game key={answer} answer={answer} />}
    </div>
  );
};
