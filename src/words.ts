// https://www-cs-faculty.stanford.edu/~knuth/sgb-words.txt
import { useEffect, useMemo, useState } from "react";
import wordBank from "./word-bank.json";

export type Answer = {
  answerId: number;
  wordBankId: number;
};
export function useNewAnswer() {
  const [answer, setAnswer] = useState<Answer>();
  useEffect(() => {
    pickNewAnswer().then(setAnswer);
  }, []);
  return answer;
}
export function useAnswer(answer: Answer) {
  return useMemo(() => {
    if (answer.wordBankId === wordBank.version) {
      return wordBank.words[answer.answerId].toUpperCase();
    }
  }, [answer]);
}

export async function pickNewAnswer(): Promise<Answer | undefined> {
  let tries = 0;
  while (tries < 10) {
    tries++;
    const { word, index } = chooseRandomWord(wordBank.words);
    if (await isAWord(word)) {
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

export async function isAWord(word: string) {
  if (!word) return false;
  const result = await fetch(
    `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`
  );
  return result.status === 200 || result.status === 304;
}
