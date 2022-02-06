import { useMemo, CSSProperties } from "react";
import { WordStatus, CharacterStatus } from "../utilities/types";

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

export default WordResult;
