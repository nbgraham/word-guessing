import { PromiseCache } from "./cache";

export type WordBank = {
  version: number;
  words: string[];
};

class WordBankService {
  cache = new PromiseCache<WordBank>();
  factories = {
    knuth: () => import("../assets/knuth-word-bank.json"), // https://www-cs-faculty.stanford.edu/~knuth/sgb-words.txt
  };

  getWordBank(wordBankKey: keyof typeof this.factories) {
    return this.cache.get(wordBankKey, () => this.factories[wordBankKey]());
  }
}

export type { WordBankService };
export const wordBankService = new WordBankService();
