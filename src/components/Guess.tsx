import React, { useState, useRef, useEffect, FormEventHandler } from "react";
import { datamuseApi } from "../services/datamuse-api";
import { useAppSelector } from "../store";
import Keyboard, { BACKSPACE, SUBMIT } from "./Keyboard";
import Spinner from "./Spinner";

const SIZE = 5;
const PATTERN = "^[a-zA-Z]*$";

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

export default Guess;
