import React, { useEffect } from "react";
import Game from "./Game";
import { useAnswerInfoParams } from "../routes";
import { useAppDispatch, useAppSelector } from "../store";
import gameSlice from "../store/gameSlice";
import Spinner from "./Spinner";

const Play: React.FC = () => {
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
      {answer ? (
        <Game key={answer} answer={answer} />
      ) : (
        <div>
          Fetching answer for game
          <Spinner size={15} />
        </div>
      )}
    </div>
  );
};
export default Play;
