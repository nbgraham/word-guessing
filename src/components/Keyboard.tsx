export const BACKSPACE = "<";
export const SUBMIT = "=";

const data = [
  ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
  ["A", "S", "D", "F", "G", "H", "J", "K", "L"],
  ["Z", "X", "C", "V", "B", "N", "M", BACKSPACE, SUBMIT],
];

export const Keyboard: React.FC<{
  disabledLetters: string[];
  highlightedLetters: string[];
  onTypeLetter: (letter: string) => void;
}> = ({ disabledLetters, highlightedLetters, onTypeLetter }) => {
  const getStyle: (letter: string) => React.CSSProperties = (letter) => {
    const disabled = disabledLetters.includes(letter);
    const highlighted = highlightedLetters.includes(letter);
    const extraStyles: React.CSSProperties = disabled
      ? {
          opacity: 0.5,
          textDecoration: "line-through",
          backgroundColor: "#545454",
        }
      : highlighted
      ? {
          backgroundColor: "#ffc107",
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
