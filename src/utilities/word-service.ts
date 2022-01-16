import wordBank from "../assets/word-bank.json"; // https://www-cs-faculty.stanford.edu/~knuth/sgb-words.txt

export type WordBank = {
    version: number,
    words: string[]
};

export async function isAWord(word: string) {
  if (!word) return false;
  const result = await fetch(
    `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`
  );
  return result.status === 200 || result.status === 304;
}

export function getWordBank(): Promise<WordBank> {
    return Promise.resolve(wordBank);
}
