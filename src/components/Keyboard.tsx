import React, { useMemo } from "react";

export const BACKSPACE = "<";
export const SUBMIT = "=";

const data = [
  ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
  ["A", "S", "D", "F", "G", "H", "J", "K", "L"],
  ["Z", "X", "C", "V", "B", "N", "M", BACKSPACE, SUBMIT],
];

const Keyboard: React.FC<{
  disabledLetters: string[];
  highlightedLetters: string[];
  onTypeLetter: (letter: string) => void;
}> = ({ disabledLetters, highlightedLetters, onTypeLetter }) => {
  return (
    <div
      style={{
        width: "100vw",
        maxWidth: 400,
        display: "flex",
        gap: 2,
        paddingTop: 20,
        flexDirection: "column",
      }}
    >
      {data.map((row, index) => (
        <div
          key={index}
          style={{ display: "flex", gap: 4, justifyContent: "center" }}
        >
          {row.map((letter) => (
            <Letter
              key={letter}
              letter={letter}
              onClick={() => onTypeLetter(letter)}
              disabled={disabledLetters.includes(letter)}
              highlighted={highlightedLetters.includes(letter)}
            />
          ))}
        </div>
      ))}
    </div>
  );
};

const Letter: React.FC<{
  letter: string;
  onClick: () => void;
  disabled: boolean;
  highlighted: boolean;
}> = ({ letter, onClick, disabled, highlighted }) => {
  const style = useMemo<React.CSSProperties>(() => {
    const disabledStyles: React.CSSProperties = disabled
      ? {
          opacity: 0.5,
          textDecoration: "line-through",
          backgroundColor: "#545454",
        }
      : {};
    const highlightedStyles: React.CSSProperties = highlighted
      ? {
          backgroundColor: "#ffc107",
        }
      : {};
    return {
      display: "flex",
      flex: 1,
      padding: "15px 0px",
      borderRadius: 4,
      justifyContent: "center",
      backgroundColor: "#808080",
      cursor: "pointer",
      ...disabledStyles,
      ...highlightedStyles,
    };
  }, [disabled, highlighted]);
  return (
    <button style={style} onClick={onClick}>
      {letter}
    </button>
  );
};

export default Keyboard;
