import { useMemo } from "react";
import { evaluateGuess } from "../utilities/guess";
import NewGame from "./NewGame";
import WordResult from "./WordResult";

const Home: React.FC = () => {
  const exampleAnswer = "spare";
  const exampleGuesses = useMemo(
    () => ["trite", "hairs", "pears", "share", "spare"],
    []
  );
  const exampleResults = useMemo(
    () =>
      exampleGuesses.map((guess) => evaluateGuess(guess, exampleAnswer).status),
    [exampleAnswer, exampleGuesses]
  );

  return (
    <div style={{ margin: 10 }}>
      After each guess:
      <ul>
        <li>Green means the letter is in the word, and in the right spot</li>
        <li>Yellow means the letter is in the word, but not in that spot</li>
        <li>No color (gray) means the letter is not in the word</li>
      </ul>
      <div style={{ margin: 10 }}>
        For example, if the answer were "SHARE", this is how these guesses would
        be displayed:
        {exampleResults.map((exampleResult, i) => (
          <WordResult key={i} guessStatus={exampleResult} />
        ))}
      </div>
      <NewGame />
    </div>
  );
};

export default Home;
