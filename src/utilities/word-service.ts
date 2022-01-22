import wordBank from "../assets/word-bank.json"; // https://www-cs-faculty.stanford.edu/~knuth/sgb-words.txt

export type WordBank = {
  version: number;
  words: string[];
};

type Definition = {
  definition: string;
  synonyms: string[];
  anotonyms: string[];
};
type Meaning = {
  partOfSpeech: string;
  definitions: Definition[];
};
export type WordResult = {
  word: string;
  phonetic: string;
  meanings: Meaning[];
};
type NotFoundResponse = {
  title: string;
  message: string;
  resolution: string;
};
type Response = WordResult[] | NotFoundResponse;

const cache: Partial<Record<string, WordResult[]>> = {};
async function cached(
  key: string,
  factory: () => Promise<WordResult[] | undefined>
) {
  if (cache[key]) return cache[key];
  cache[key] = await factory();
  return cache[key];
}

export async function isAWord(word: string) {
  const wordResults = await getDefinition(word);
  return !!wordResults;
}

export function getDefinition(word: string) {
  return cached(word.toUpperCase(), async () => {
    if (!word) return undefined;

    const result = await fetch(
      `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`
    );
    const data: Response = await result.json();

    const found =
      result.status < 400 &&
      Array.isArray(data) &&
      data.some((wordResult) => wordResult.word);

    if (found) {
      return data;
    }
  });
}

export function getWordBank(): WordBank {
  return wordBank;
}
