import { useEffect, useMemo, useState } from "react";
import { isAWord } from "./word-service";
import wordBank from "../assets/word-bank.json"; // https://www-cs-faculty.stanford.edu/~knuth/sgb-words.txt

export type AnswerInfo = {
  answerId: number;
  wordBankId: number;
};
export function useNewAnswer() {
  const [answer, setAnswer] = useState<AnswerInfo>();
  useEffect(() => {
    pickNewAnswer().then(setAnswer);
  }, []);
  return answer;
}
export function useAnswer(answer: AnswerInfo) {
  return useMemo(() => {
    if (answer.wordBankId === wordBank.version) {
      return wordBank.words[answer.answerId].toUpperCase();
    }
  }, [answer]);
}

export async function pickNewAnswer(): Promise<AnswerInfo | undefined> {
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
