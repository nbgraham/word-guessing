import React, { useCallback } from "react";
import { useAppDispatch, useAppSelector } from "../store";
import Victory from "./Victory";
import gameSlice from "../store/gameSlice";
import Guess from "./Guess";
import { getBestNextGuess } from "../utilities/guess";
import WordResult from "./WordResult";

const EMPTY: [] = [];

const Game: React.FC<{
  answer: string;
}> = ({ answer }) => {
  const answerState = useAppSelector((state) => state.game.answers[answer]);
  const guesses = answerState?.guesses ?? EMPTY;
  const eliminatedLetters = answerState?.eliminatedLetters ?? EMPTY;
  const foundLetters = answerState?.foundLetters ?? EMPTY;
  const won = answerState?.won ?? false;

  const dispatch = useAppDispatch();
  const handleSubmitGuess = useCallback(
    (guess: string) => {
      dispatch(
        gameSlice.actions.submitGuess({
          guess,
          answer,
        })
      );
    },
    [dispatch, answer]
  );

  const autoGuess = useCallback(async () => {
    const bestNextGuess = await getBestNextGuess(
      guesses,
      eliminatedLetters,
      foundLetters
    );
    if (bestNextGuess) {
      handleSubmitGuess(bestNextGuess);
    } else {
      console.error("No best next guess found");
    }
  }, [guesses, eliminatedLetters, foundLetters, handleSubmitGuess]);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 10,
        paddingTop: 20,
      }}
    >
      {!won && (
        <div>
          <button onClick={() => handleSubmitGuess(answer)}>
            Just tell me the answer
          </button>
        </div>
      )}
      {guesses.map((guess, index) => (
        <WordResult key={index} guessStatus={guess} />
      ))}
      {won ? (
        <Victory guesses={guesses} answer={answer} />
      ) : (
        <>
          <button onClick={autoGuess}>Guess for me</button>
          <Guess
            key={guesses.length}
            onSubmitGuess={handleSubmitGuess}
            eliminatedLetters={eliminatedLetters}
            foundLetters={foundLetters}
          />
        </>
      )}
    </div>
  );
};

export default Game;
