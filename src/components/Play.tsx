import React from "react";
import { useAnswer, useNewAnswer } from "../utilities/words";
import { Navigate } from "react-router-dom";
import { Spinner } from "./Spinner";
import { Game } from "./Game";
import { routes, useAnswerInfoParams } from "../routes";

export const PlayNew: React.FC = () => {
  const answer = useNewAnswer();
  return answer === undefined ? (
    <div>
      Loading Game <Spinner size={15} />
    </div>
  ) : (
    <Navigate replace to={routes.playInstance(answer)} />
  );
};

export const Play: React.FC = () => {
  const answerInfo = useAnswerInfoParams();
  const answer = useAnswer(answerInfo);

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
