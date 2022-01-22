import React, {
  CSSProperties,
  FormEventHandler,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useAppDispatch, useAppSelector } from "../store";
import Keyboard, { BACKSPACE, SUBMIT } from "./Keyboard";
import Spinner from "./Spinner";
import Victory from "./Victory";
import { CharacterStatus, WordStatus } from "../utilities/types";
import gameSlice from "../store/gameSlice";
import { datamuseApi } from "../services/datamuse-api";

const SIZE = 5;
const PATTERN = "^[a-zA-Z]*$";

const Game: React.FC<{
  answer: string;
}> = ({ answer }) => {
  const answerState = useAppSelector((state) => state.game.answers[answer]);
  const guesses = useMemo(() => answerState?.guesses ?? [], [answerState]);
  const eliminatedLetters = useMemo(
    () => answerState?.eliminatedLetters ?? [],
    []
  );
  const foundLetters = answerState?.foundLetters ?? [];
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

  const autoGuess = useCallback(() => {
    const spelledLike = new Array(5)
      .fill(null)
      .map((_, i) => {
        const correctLetter = guesses.find(
          (guess) => guess[i].inPosition && guess[i].inWord
        );
        return correctLetter?.[i].character ?? "?";
      })
      .join("");

    return datamuseApi
      .getWordsInfo({
        spelledLike: spelledLike,
        max: 20,
      })
      .then((wordsInfo) => {
        const pastGuesses = guesses.map((guess) =>
          guess
            .map((status) => status.character)
            .join("")
            .toUpperCase()
        );
        const newWordInfos = wordsInfo
          .filter(
            (wordInfo) => !pastGuesses.includes(wordInfo.word.toUpperCase())
          )
          .filter((wordInfo) =>
            wordInfo.word
              .toUpperCase()
              .split("")
              .every((letter) => !eliminatedLetters.includes(letter))
          )
          .sort((a, b) => (b.frequency ?? 0) - (a.frequency ?? 0))[0];
        if (newWordInfos?.word) {
          handleSubmitGuess(newWordInfos.word);
        }
      });
  }, [guesses, eliminatedLetters, handleSubmitGuess]);

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

const Guess: React.FC<{
  onSubmitGuess: (guess: string) => void;
  eliminatedLetters: string[];
  foundLetters: string[];
}> = ({ onSubmitGuess, eliminatedLetters, foundLetters }) => {
  const [guess, _setGuess] = useState("");
  const setGuess = (g: string) => _setGuess(g.substring(0, SIZE));
  const [submitting, setSubmitting] = useState(false);
  const guessesMustBeValidWords = useAppSelector(
    (state) => state.settings.guessesMustBeValidWords
  );

  const formRef = useRef<HTMLFormElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    inputRef.current?.focus();
  }, [inputRef]);

  const handleSubmit: FormEventHandler = async (event) => {
    event.preventDefault();

    if (submitting) return;
    setSubmitting(true);

    if (!formRef.current?.checkValidity()) {
      alert("Invalid form");
    } else {
      const errorMessage = await asyncValidation(guess);
      inputRef.current?.setCustomValidity(errorMessage || "");
      if (!errorMessage) {
        onSubmitGuess(guess);
      } else {
        inputRef.current?.reportValidity();
        formRef.current?.requestSubmit();
      }
    }

    setSubmitting(false);
  };
  const asyncValidation = async (value: string) => {
    if (guessesMustBeValidWords && !(await datamuseApi.isAWord(value)))
      return `"${value}" is not an English word`;
  };

  useEffect(() => {
    inputRef.current?.setCustomValidity(realTimeValidation(guess));
  }, [guess]);
  const realTimeValidation = (value: string) => {
    if (value.length < SIZE)
      return `Too short, must be more than ${SIZE} characters`;
    if (value.length > SIZE)
      return `Too long, must be less than ${SIZE} characters`;
    if (!new RegExp(PATTERN).test(value)) return "Only letters are allowed";
    return "";
  };

  const handleTypeLetter = (letter: string) => {
    switch (letter) {
      case BACKSPACE:
        setGuess(guess.substring(0, guess.length - 1));
        break;
      case SUBMIT:
        formRef.current?.requestSubmit();
        break;
      default:
        setGuess(guess + letter);
        break;
    }
  };

  return (
    <React.Fragment>
      <form ref={formRef} onSubmit={handleSubmit}>
        <input
          ref={inputRef}
          placeholder="Guess"
          disabled={submitting}
          type="text"
          title="Only letters are allowed"
          required={true}
          pattern={PATTERN}
          minLength={SIZE}
          maxLength={SIZE}
          value={guess}
          onChange={(event) => setGuess(event.target.value)}
        />
        {submitting && <Spinner size={15} />}
        <button disabled={submitting} type="submit">
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
  return (
    <div style={{ display: "flex", maxWidth: 300 }}>
      {guessStatus.map((status, index) => (
        <WordLetter key={index} status={status} />
      ))}
    </div>
  );
};

const WordLetter: React.FC<{ status: CharacterStatus }> = ({ status }) => {
  const color = useMemo(
    () =>
      status.inWord ? (status.inPosition ? "green" : "yellow") : "#dddddd",
    [status]
  );
  const style = useMemo<CSSProperties>(() => {
    return {
      display: "flex",
      flex: 1,
      padding: "15px 15px",
      margin: 3,
      border: "1px solid black",
      borderRadius: 4,
      justifyContent: "center",
      backgroundColor: color,
    };
  }, [color]);

  return <div style={style}>{status.character}</div>;
};

export default Game;
