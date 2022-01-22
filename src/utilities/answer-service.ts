import { VersionKey } from "./types";
import { WordBankService } from "./word-bank-service";
import { WordService } from "./word-service";

export interface AnswerService {
  version: VersionKey;
  getNewAnswerKey(mustBeValidWord: boolean): Promise<string | null>;
  getAnswer(answerKey: string): Promise<string | undefined>;
}

export class StaticAnswerService implements AnswerService {
  version: number;
  private wordService: WordService;
  private wordBankService: WordBankService;

  constructor(
    version: number,
    wordService: WordService,
    wordBankService: WordBankService
  ) {
    this.version = version;
    this.wordBankService = wordBankService;
    this.wordService = wordService;
  }

  async getNewAnswerKey(mustBeValidWord: boolean): Promise<string | null> {
    let tries = 0;
    const wordBank = await this.getWordBank();
    while (tries < 10) {
      tries++;
      const words = wordBank.words;
      const index = Math.floor(words.length * Math.random());
      const word = words[index];

      const valid = !mustBeValidWord || (await this.wordService.isAWord(word));
      if (valid) {
        return index.toString();
      } else {
        console.warn(`"${word}" is not a word. Looking for another word.`);
      }
    }
    return null;
  }

  async getAnswer(answerKey: string): Promise<string | undefined> {
    const wordBank = await this.getWordBank();
    const index = parseInt(answerKey);
    return wordBank.words[index];
  }

  private getWordBank() {
    return this.wordBankService.getWordBank();
  }
}
