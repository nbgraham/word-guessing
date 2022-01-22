import React, { useEffect } from "react";
import Game from "./Game";
import { useAnswerInfoParams } from "../routes";
import { useAppDispatch, useAppSelector } from "../store";
import { startNewGame } from "../store/gameSlice";
import Spinner from "./Spinner";

const Play: React.FC = () => {
  const answerInfo = useAnswerInfoParams();

  const answer = useAppSelector((state) => state.game.answer);
  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(startNewGame(answerInfo));
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
      {answer.value ? (
        <Game key={answer.value} answer={answer.value} />
      ) : answer.state === "loading" ? (
        <>
          Fetching answer for game
          <Spinner size={15} />
        </>
      ) : (
        <>Error fetching answer</>
      )}
    </div>
  );
};
export default Play;
