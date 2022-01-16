import React, { useEffect } from "react";
import { useAnswer, useNewAnswer } from "../utilities/answers";
import { Navigate } from "react-router-dom";
import Spinner from "./Spinner";
import Game from "./Game";
import { routes, useAnswerInfoParams } from "../routes";
import type { WordBank } from "../utilities/word-service";
import { actions, useAppDispatch } from "../store";

export const PlayNew: React.FC<{ wordBank: WordBank }> = ({ wordBank }) => {
  const answer = useNewAnswer(wordBank);
  return answer === undefined ? (
    <div>
      Loading Game <Spinner size={15} />
    </div>
  ) : (
    <Navigate replace to={routes.playInstance(answer)} />
  );
};

export const Play: React.FC<{ wordBank: WordBank }> = ({ wordBank }) => {
  const answerInfo = useAnswerInfoParams();
  const answer = useAnswer(wordBank, answerInfo);

  const dispatch = useAppDispatch();
  useEffect(() => {
    if (answer) dispatch(actions.pickAnswer(answer));
  }, [answer, dispatch]);

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
