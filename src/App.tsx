import React, {
  FormEventHandler,
  Reducer,
  useEffect,
  useMemo,
  useReducer,
  useRef,
  useState,
} from "react";
import { getRandomWord, isAWord } from "./words";

const SIZE = 5;
const ALLOW_NON_WORD_GUESSES = false;

function App() {
  const [answer, setAnswer] = useState(getRandomWord(SIZE));
  const handleRestart = () => {
    setAnswer(getRandomWord(SIZE));
  };

  return <Game key={answer} answer={answer} onRestart={handleRestart} />;
}

const Game: React.FC<{
  answer: string;
  onRestart: () => void;
}> = ({ answer, onRestart }) => {
  const [guesses, addGuess] = useReducer<Reducer<string[], string>>(
    (state, action) => [...state, action],
    []
  );
  const [won, setWon] = useState(false);
  const handleSubmitGuess = (guess: string) => {
    addGuess(guess);
    if (guess.toUpperCase() === answer.toUpperCase()) {
      setWon(true);
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      {guesses.map((guess, index) => (
        <WordResult key={index} answer={answer} guess={guess} />
      ))}
      {won ? (
        <div>
          You won!
          <button onClick={onRestart}>Restart?</button>
        </div>
      ) : (
        <Guess key={guesses.length} onSubmitGuess={handleSubmitGuess} />
      )}
    </div>
  );
};

const Guess: React.FC<{
  onSubmitGuess: (guess: string) => void;
}> = ({ onSubmitGuess }) => {
  const [guess, setGuess] = useState("");
  const [validating, setValidating] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const validate = async (value: string) => {
    setValidating(true);
    const isValid = ALLOW_NON_WORD_GUESSES || (await isAWord(value));
    setErrorMessage(isValid ? "" : `"${value}" is not an English word`);
    setValidating(false);
    return isValid;
  };

  const handleSubmit: FormEventHandler = async (event) => {
    event.preventDefault();
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
  );
};

const WordResult: React.FC<{
  guess: string;
  answer: string;
}> = ({ guess, answer }) => {
  const guessC = useMemo(() => guess.toUpperCase(), [guess]);
  const answerC = useMemo(() => answer.toUpperCase(), [answer]);

  const getColor = (index: number) => {
    if (guessC[index] === answerC[index]) {
      return "green";
    }
    if (answerC.includes(guessC[index])) {
      return "yellow";
    }
  };

  return (
    <div style={{ display: "flex", maxWidth: 100 }}>
      {guessC.split("").map((letter, index) => (
        <div
          key={index}
          style={{
            backgroundColor: getColor(index),
            flex: 1,
            display: "flex",
            justifyContent: "center",
          }}
        >
          {letter}
        </div>
      ))}
    </div>
  );
};

export default App;
