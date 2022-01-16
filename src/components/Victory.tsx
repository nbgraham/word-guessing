import { useMemo, useState } from "react";
import { WordStatus } from "../utilities/types";

const canShare = typeof navigator.share === "function";

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

export default Victory;