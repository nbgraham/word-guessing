

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

export interface WordService {
  isAWord(word: string): Promise<boolean>;
  getDefinition(word: string): Promise<WordResult[] | undefined>;
}

export class DictionaryApi implements WordService {

  async isAWord(word: string) {
    const wordResults = await this.getDefinition(word);
    return !!wordResults;
  }
  
  async getDefinition(word: string) {
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
}