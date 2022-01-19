import React, { useEffect } from "react";
import { Navigate } from "react-router-dom";
import Spinner from "./Spinner";
import Game from "./Game";
import { routes, useAnswerInfoParams } from "../routes";
import type { WordBank } from "../utilities/word-service";
import { useAppDispatch, useAppSelector } from "../store";
import gameSlice, { pickNewAnswer } from "../store/gameSlice";

export const PlayNew: React.FC<{ wordBank: WordBank }> = ({ wordBank }) => {
  const newAnswerInfo = useAppSelector((state) => state.game.newAnswerInfo);
  const mustBeValidWord = useAppSelector(
    (state) => state.settings.guessesMustBeValidWords
  );

  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(pickNewAnswer({ wordBank, mustBeValidWord }));
  }, [dispatch, wordBank, mustBeValidWord]);

  return newAnswerInfo === undefined ? (
    <div>
      Loading Game <Spinner size={15} />
    </div>
  ) : (
    <Navigate replace to={routes.playInstance(newAnswerInfo)} />
  );
};

export const Play: React.FC = () => {
  const answerInfo = useAnswerInfoParams();
  const answer = useAppSelector((state) => state.game.answer);
  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(gameSlice.actions.startGame(answerInfo));
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
