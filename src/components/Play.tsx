import React, { useEffect } from "react";
import { Navigate } from "react-router-dom";
import Spinner from "./Spinner";
import Game from "./Game";
import { routes, useAnswerInfoParams } from "../routes";
import type { WordBank } from "../utilities/word-service";
import {
  actions,
  pickNewAnswer,
  useAppDispatch,
  useAppSelector,
} from "../store";

export const PlayNew: React.FC<{ wordBank: WordBank }> = ({ wordBank }) => {
  const newAnswer = useAppSelector((state) => state.game.newAnswer);
  const mustBeValidWord = useAppSelector(
    (state) => state.settings.guessesMustBeValidWords
  );

  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(pickNewAnswer({ wordBank, mustBeValidWord }));
  }, [dispatch, wordBank, mustBeValidWord]);

  return newAnswer === undefined ? (
    <div>
      Loading Game <Spinner size={15} />
    </div>
  ) : (
    <Navigate replace to={routes.playInstance(newAnswer)} />
  );
};

export const Play: React.FC = () => {
  const answerInfo = useAnswerInfoParams();
  const answer = useAppSelector(state => state.game.answer);
  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(actions.startGame(answerInfo));
  }, [dispatch, answerInfo]);

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
