import { Encryption } from "../utilities/encryption";
import { VersionKey } from "../utilities/types";
import { WordBankService } from "./word-bank-service";
import { WordService } from "./word-service";
import { wordsApi } from "./words-api";

abstract class AnswerService {
  version: VersionKey;
  constructor(version: VersionKey) {
    this.version = version;
  }

  abstract getNewAnswerKey(
    mustBeValidWord: boolean
  ): Promise<string | undefined>;
  abstract getAnswer(answerKey: string): Promise<string | undefined>;
}
export type { AnswerService };

export class StaticAnswerService extends AnswerService {
  private wordService: WordService;
  private wordBankService: WordBankService;

  constructor(
    version: VersionKey,
    wordService: WordService,
    wordBankService: WordBankService
  ) {
    super(version);
    this.wordBankService = wordBankService;
    this.wordService = wordService;
  }

  async getNewAnswerKey(mustBeValidWord: boolean): Promise<string | undefined> {
    const wordBank = await this.getWordBank();
    const words = wordBank.words;

    let tries = 0;
    while (tries < 10) {
      tries++;

      const index = Math.floor(words.length * Math.random());
      const word = words[index];

      const valid = !mustBeValidWord || (await this.wordService.isAWord(word));
      if (valid) {
        return index.toString();
      } else {
        console.warn(`"${word}" is not a word. Looking for another word.`);
      }
    }

    throw new Error(`Used all ${tries} tries and could not find a valid word`);
  }

  async getAnswer(answerKey: string): Promise<string | undefined> {
    const wordBank = await this.getWordBank();
    const index = parseInt(answerKey);
    return wordBank?.words[index];
  }

  private getWordBank() {
    return this.wordBankService.getWordBank("knuth");
  }
}

export class WordsApiAnswerService extends AnswerService {
  encryption: Encryption;

  constructor(version: VersionKey) {
    super(version);
    this.encryption = new Encryption();
  }

  async getNewAnswerKey(): Promise<string | undefined> {
    let tries = 0;
    while (tries < 10) {
      tries++;

      const wordInfo = await wordsApi.getRandomWord();
      if (wordsApi.isCommon(wordInfo.word)) {
        return this.encryption.encrypt(wordInfo.wordKey);
      } else {
        console.debug(
          `"${wordInfo.wordKey}" is not a common word. Looking for another word.`
        );
      }
    }
    
    throw new Error(`Used all ${tries} tries and could not get a common word`);
  }

  getAnswer(answerKey: string): Promise<string | undefined> {
    return Promise.resolve(this.encryption.decrypt(answerKey));
  }
}
