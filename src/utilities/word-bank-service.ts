export type WordBank = {
  version: number;
  words: string[];
};

const factories = {
  'knuth': () => import("../assets/knuth-word-bank.json") // https://www-cs-faculty.stanford.edu/~knuth/sgb-words.txt
}
type WordBankKey = keyof typeof factories;

export class WordBankService {
    private _getWordBankPromise: Promise<WordBank> | undefined;
    private wordBankKey: WordBankKey;

    constructor(wordBankKey: WordBankKey) {
      this.wordBankKey = wordBankKey;
    }
  
    getWordBank() {
      this._getWordBankPromise ??= this._getWordBank();
      return this._getWordBankPromise;
    }

    private _getWordBank() {
      const factory = factories[this.wordBankKey];
      return factory();
    }
}