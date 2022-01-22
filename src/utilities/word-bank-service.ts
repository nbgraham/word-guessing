export type WordBank = {
  version: number;
  words: string[];
};

export class WordBankService {
    private _getWordBank: () => Promise<WordBank>;
    private _getWordBankPromise: Promise<WordBank> | undefined;
  
    constructor(getWordBank: () => Promise<WordBank>) {
      this._getWordBank = getWordBank;
    }
  
    getWordBank() {
      this._getWordBankPromise ??= this._getWordBank();
      return this._getWordBankPromise;
    }
}