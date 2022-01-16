import React, { FormEventHandler, useEffect, useRef, useState } from "react";
import { isAWord } from "../utilities/word-service";
import { actions, useAppDispatch, useAppSelector } from "../store";
import { BACKSPACE, SUBMIT, Keyboard } from "./Keyboard";
import { Spinner } from "./Spinner";
import { Victory } from "./Victory";
import { CharacterStatus, WordStatus } from "../utilities/types";

const SIZE = 5;

export const Game: React.FC<{
  answer: string;
}> = ({ answer }) => {
  const answerState = useAppSelector((state) => state.answers[answer]);
  const guesses = answerState?.guesses ?? [];
  const eliminatedLetters = answerState?.eliminatedLetters ?? [];
  const foundLetters = answerState?.foundLetters ?? [];
  const won = answerState?.won ?? false;

  const dispatch = useAppDispatch();
  const handleSubmitGuess = (guess: string) => {
    dispatch(
      actions.submitGuess({
        guess,
        answer,
      })
    );
  };

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
        <Victory guesses={guesses} />
      ) : (
        <Guess
          key={guesses.length}
          onSubmitGuess={handleSubmitGuess}
          eliminatedLetters={eliminatedLetters}
          foundLetters={foundLetters}
        />
      )}
    </div>
  );
};

const Guess: React.FC<{
  onSubmitGuess: (guess: string) => void;
  eliminatedLetters: string[];
  foundLetters: string[];
}> = ({ onSubmitGuess, eliminatedLetters, foundLetters }) => {
  const [guess, setGuess] = useState("");
  const [validating, setValidating] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const guessesMustBeValidWords = useAppSelector(
    (state) => state.settings.guessesMustBeValidWords
  );

  const validate = async (value: string) => {
    setValidating(true);
    const isValid = !guessesMustBeValidWords || (await isAWord(value));
    setErrorMessage(isValid ? "" : `"${value}" is not an English word`);
    setValidating(false);
    return isValid;
  };

  const handleSubmit: FormEventHandler = async (event) => {
    event.preventDefault();
    await submitGuess();
  };
  const submitGuess = async () => {
    if (await validate(guess)) {
      onSubmitGuess?.(guess);
    }
  };

  const inputRef = useRef<HTMLInputElement | null>(null);
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [inputRef]);

  const handleTypeLetter = (letter: string) => {
    switch (letter) {
      case BACKSPACE:
        setGuess(guess.substring(0, guess.length - 1));
        break;
      case SUBMIT:
        submitGuess();
        break;
      default:
        setGuess(guess + letter);
        break;
    }
  };

  return (
    <React.Fragment>
      <form onSubmit={handleSubmit}>
        <input
          ref={inputRef}
          placeholder="Guess"
          required={true}
          disabled={validating}
          type="text"
          pattern="^[a-zA-Z]*$"
          title="Only letters are allowed"
          minLength={SIZE}
          maxLength={SIZE}
          value={guess}
          onChange={(event) => setGuess(event.target.value)}
        />
        {validating && <Spinner size={15} />}
        <div style={{ color: "red" }}>{errorMessage}</div>
        <button disabled={validating} type="submit">
          Submit
        </button>
      </form>
      <Keyboard
        disabledLetters={eliminatedLetters}
        highlightedLetters={foundLetters}
        onTypeLetter={handleTypeLetter}
      />
    </React.Fragment>
  );
};

const WordResult: React.FC<{
  guessStatus: WordStatus;
}> = ({ guessStatus }) => {
  const getColor = (status: CharacterStatus) => {
    if (status.inWord) {
      return status.inPosition ? "green" : "yellow";
    }
  };

  return (
    <div style={{ display: "flex", maxWidth: 100 }}>
      {guessStatus.map((status, index) => (
        <div
          key={index}
          style={{
            backgroundColor: getColor(status),
            flex: 1,
            minWidth: 12,
            display: "flex",
            justifyContent: "center",
          }}
        >
          {status.character}
        </div>
      ))}
    </div>
  );
};
