import React, {
  FormEventHandler,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useObservable } from "../utilities/observable";
import { isAWord, useAnswer, useNewAnswer } from "../utilities/words";
import { Navigate, useParams } from "react-router-dom";
import { $allowNonWordGuesses } from "./Settings";
import {
  actions,
  CharacterStatus,
  useAppDispatch,
  useAppSelector,
  WordStatus,
} from "../store";
import spinner from "../assets/spinner.gif";
import { BACKSPACE, SUBMIT, Keyboard } from "./Keyboard";

const SIZE = 5;

const Spinner: React.FC<{ size: number }> = ({ size }) => {
  return (
    <img alt="loading" src={spinner} style={{ width: size, height: size }} />
  );
};

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

const Game: React.FC<{
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

  if (!answer) {
    return null;
  }

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

const Victory: React.FC<{
  guesses: WordStatus[];
}> = ({ guesses }) => {
  const guessSummary = useMemo(
    () =>
      guesses
        .map((guess) =>
          guess
            .map((letter) => {
              if (letter.inPosition && letter.inWord) return "🟩";
              if (letter.inWord) return "🟨";
              return "⬛️";
            })
            .join("")
        )
        .join("\n"),
    [guesses]
  );
  const shareText = useMemo(
    () => `I won in ${guesses.length} guesses!\n` + guessSummary,
    [guessSummary, guesses.length]
  );

  const canShare = typeof navigator.share === "function";
  const [copied, setCopied] = useState(false);
  const copyShareText = async () => {
    await navigator.clipboard.writeText(
      shareText + `\nTry for yourself at ${window.location.href}`
    );
    setCopied(true);
  };

  const share = () => {
    navigator.share({
      text: shareText,
      title: "Word Guessing Game",
      url: window.location.href,
    });
  };

  return (
    <div>
      <p>You won!</p>
      <pre>{guessSummary}</pre>
      {canShare ? (
        <button onClick={share}>Share</button>
      ) : (
        <button onClick={copyShareText}>Copy Share Text</button>
      )}
      {copied && <div>Copied!</div>}
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
  const [allowNonWordGuesses] = useObservable($allowNonWordGuesses);

  const validate = async (value: string) => {
    setValidating(true);
    const isValid = allowNonWordGuesses || (await isAWord(value));
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
