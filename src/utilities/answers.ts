import { useEffect, useMemo, useState } from "react";
import { isAWord, WordBank } from "./word-service";
import { useAppSelector } from "../store";

class CancellablePromise<T> {
  _reject?: (reason?: any) => void;
  promise: Promise<T>;

  constructor(promise: Promise<T>) {
    this.promise = new Promise<T>((resolve, reject) => {
      this._reject = reject;
      promise.then(resolve).catch(reject);
    });
  }

  cancel(reason?: any) {
    this._reject?.(reason);
  }
}

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
      const cancellable = new CancellablePromise(
        pickNewAnswer(wordBank, guessesMustBeValidWords)
      );
      cancellable.promise.then(setAnswer).catch(console.warn);
      return () =>
        cancellable.cancel("Promise cancelled as part of useEffect cleanup");
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
