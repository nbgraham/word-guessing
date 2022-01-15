import React, {
  FormEventHandler,
  Reducer,
  useEffect,
  useMemo,
  useReducer,
  useRef,
  useState,
} from "react";
import { unique } from "./array";
import { Observable, useObservable } from "./observable";
import { isAWord, useAnswer, useNewAnswer } from "./words";
import { Navigate, useParams } from "react-router-dom";

const SIZE = 5;
const BACKSPACE = "<";
const SUBMIT = "=";

const $allowNonWordGuesses = new Observable(false);

export const PlayNew: React.FC = () => {
  const answer = useNewAnswer();
  return answer === undefined ? (
    <div>Loading Game...</div>
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

  const [allowNonWordGuesses, setAllowNonWordGuesses] =
    useObservable($allowNonWordGuesses);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 30,
      }}
    >
      <div>
        <h2>
          Game ID {wordBankId}:{answerId}
        </h2>
        <strong>Game Settings</strong>
        <Checkbox
          label="Allow non-word guesses"
          checked={allowNonWordGuesses}
          onChange={setAllowNonWordGuesses}
        />
      </div>

      {answer && <Game key={answer} answer={answer} />}
    </div>
  );
};

const Checkbox: React.FC<{
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}> = ({ label, checked, onChange }) => {
  const toggle = () => onChange(!checked);
  return (
    <div>
      <label onClick={toggle}>{label}</label>
      <input
        type="checkbox"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
      />
    </div>
  );
};

type CharacterStatus = {
  character: string;
  inWord: boolean;
  inPosition: boolean;
};
type WordStatus = CharacterStatus[];

const Game: React.FC<{
  answer: string;
}> = ({ answer }) => {
  const [guesses, addGuess] = useReducer<Reducer<WordStatus[], WordStatus>>(
    (state, action) => [...state, action],
    []
  );
  const [eliminatedLetters, addEliminatedLetters] = useReducer<
    Reducer<string[], string[]>
  >((state, action) => unique([...state, ...action]).sort(), []);
  const [won, setWon] = useState(false);

  const handleSubmitGuess = (guess: string) => {
    const guessC = guess.toUpperCase();
    const status: WordStatus = guessC.split("").map((character, i) => ({
      character,
      inWord: answer.includes(character),
      inPosition: answer[i] === character,
    }));

    addGuess(status);
    addEliminatedLetters(
      status.filter((s) => !s.inWord).map((s) => s.character)
    );

    if (guessC === answer) {
      setWon(true);
    }
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
        gap: 5,
      }}
    >
      <div>
        <button onClick={() => handleSubmitGuess(answer)}>
          Just tell me the answer
        </button>
      </div>
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
        />
      )}
    </div>
  );
};

const Victory: React.FC<{
  guesses: WordStatus[];
}> = ({ guesses }) => {
  const summary = useMemo(
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

  const copySummary = async () => {
    await navigator.clipboard.writeText(summary);
  };

  return (
    <div>
      <p>You won!</p>
      <pre>{summary}</pre>
      <button onClick={copySummary}>Copy Results</button>
    </div>
  );
};

const Keyboard: React.FC<{
  disabledLetters: string[];
  onTypeLetter: (letter: string) => void;
}> = ({ disabledLetters, onTypeLetter }) => {
  const rows = useMemo(
    () => ["QWERTYUIOP", "ASDFGHJKL", `ZXCVBNM${BACKSPACE}${SUBMIT}`],
    []
  );
  const data = useMemo(() => rows.map((row) => row.split("")), [rows]);

  const getStyle: (letter: string) => React.CSSProperties = (letter) => {
    const disabled = disabledLetters.includes(letter);
    const extraStyles: React.CSSProperties = disabled
      ? {
          opacity: 0.5,
          textDecoration: "line-through",
          backgroundColor: "#545454",
        }
      : {};
    return {
      display: "flex",
      flex: 1,
      padding: "10px 2px",
      borderRadius: 4,
      justifyContent: "center",
      backgroundColor: "#808080",
      cursor: "pointer",
      ...extraStyles,
    };
  };

  return (
    <div
      style={{
        width: "100vw",
        maxWidth: 400,
        display: "flex",
        gap: 4,
        flexDirection: "column",
      }}
    >
      {data.map((row, index) => (
        <div
          key={index}
          style={{ display: "flex", gap: 4, justifyContent: "center" }}
        >
          {row.map((letter) => (
            <div
              key={letter}
              style={getStyle(letter)}
              onClick={() => onTypeLetter(letter)}
            >
              {letter}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

const Guess: React.FC<{
  onSubmitGuess: (guess: string) => void;
  eliminatedLetters: string[];
}> = ({ onSubmitGuess, eliminatedLetters }) => {
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
        <div style={{ color: "red" }}>{errorMessage}</div>
      </form>
      <Keyboard
        disabledLetters={eliminatedLetters}
        onTypeLetter={(letter) =>
          letter === BACKSPACE
            ? setGuess(guess.substring(0, guess.length - 1))
            : letter === SUBMIT
            ? submitGuess()
            : setGuess(guess + letter)
        }
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
