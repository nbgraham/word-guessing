import { random } from "../utilities/array";
import { PromiseCache } from "../utilities/cache";

type Words = Record<string, Word>;
export type Word = {
  frequency?: {
    zipf: number;
    perMillion: number;
    diversity: number;
  };
  definitions?: Definition[];
};
type Definition = {
  definition: string;
  partOfSpeech: string;
  synonyms: string[];
};

class WordsApi {
  cache = new PromiseCache<Words>();

  private async getWords() {
    const words = await this.cache.get(
      "words-api",
      () => import("../assets/wordsapi_5.json") as Promise<any>
    );
    if (!words) throw new Error("Could not get words");
    return words;
  }

  async isAWord(word: string) {
    const words = await this.getWords();
    return !!words[word];
  }

  async getRandomWord() {
    const words = await this.getWords();
    const wordKeys = Object.keys(words);

    const wordKey = random(wordKeys);
    const word = words[wordKey];

    return { wordKey, word };
  }

  isCommon(word: Word) {
    return (
      word.frequency?.zipf ?? (0 > 3 && (word.definitions ?? []).length > 0)
    );
  }
}

export const wordsApi = new WordsApi();
