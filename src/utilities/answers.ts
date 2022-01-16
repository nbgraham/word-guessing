import { useEffect, useMemo, useState } from "react";
import { isAWord, WordBank } from "./word-service";
import { useAppSelector } from "../store";

export type AnswerInfo = {
  answerId: number;
  wordBankId: number;
};
export function useNewAnswer(wordBank: WordBank | undefined) {
  const [answer, setAnswer] = useState<AnswerInfo>();
  const guessesMustBeValidWords = useAppSelector(
    (state) => state.settings.guessesMustBeValidWords
  );
  useEffect(() => {
    if (wordBank) {
      pickNewAnswer(wordBank, guessesMustBeValidWords).then(setAnswer);
    }
  }, [guessesMustBeValidWords, wordBank]);
  return answer;
}
export function useAnswer(wordBank: WordBank | undefined, answer: AnswerInfo) {
  return useMemo(() => {
    if (wordBank && answer.wordBankId === wordBank.version) {
      return wordBank.words[answer.answerId].toUpperCase();
    }
  }, [answer, wordBank]);
}

export async function pickNewAnswer(
  wordBank: WordBank,
  mustBeValidWord = true
): Promise<AnswerInfo | undefined> {
  let tries = 0;
  while (tries < 10) {
    tries++;
    const { word, index } = chooseRandomWord(wordBank.words);
    if (!mustBeValidWord || (await isAWord(word))) {
      return {
        answerId: index,
        wordBankId: wordBank.version,
      };
    } else {
      console.warn(`"${word}" is not a word. Looking for another word.`);
    }
  }
  return undefined;
}

function chooseRandomWord(words: string[]) {
  const index = Math.floor(words.length * Math.random());
  return {
    word: words[index],
    index,
  };
}
