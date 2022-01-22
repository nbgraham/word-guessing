import { random } from "../utilities/array";
import { Encryption } from "../utilities/encryption";
import { VersionKey, WordValidator } from "../utilities/types";
import { datamuseApi } from "./datamuse-api";
import { WordBankService } from "./word-bank-service";
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
  private wordValidator: WordValidator;
  private wordBankService: WordBankService;

  constructor(
    version: VersionKey,
    wordValidator: WordValidator,
    wordBankService: WordBankService
  ) {
    super(version);
    this.wordBankService = wordBankService;
    this.wordValidator = wordValidator;
  }

  async getNewAnswerKey(mustBeValidWord: boolean): Promise<string | undefined> {
    const wordBank = await this.getWordBank();
    const words = wordBank.words;

    let tries = 0;
    while (tries < 10) {
      tries++;

      const index = Math.floor(words.length * Math.random());
      const word = words[index];

      const valid = !mustBeValidWord || (await this.wordValidator.isAWord(word));
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

export class DatamuseApiAnswerService extends AnswerService {
  encryption: Encryption;
  minFrequency = 10;

  constructor(version: VersionKey) {
    super(version);
    this.encryption = new Encryption();
  }

  async getNewAnswerKey(): Promise<string | undefined> {
    let tries = 0;
    while (tries < 10) {
      tries++;

      const limitStart = Math.random() < 0.5;
      const randomLetter = this.getRandomLetter();
      const spelledLike = `${limitStart ? randomLetter : "?"}???${
        !limitStart ? randomLetter : "?"
      }`;

      const wordsInfo = await datamuseApi.getWordsInfo({
        spelledLike,
        max: 100,
        metadata: {
          frequency: true,
        },
      });

      const frequentWords = wordsInfo
        .filter(
          (wordInfo) =>
            wordInfo.frequency && wordInfo.frequency > this.minFrequency
        )
        .filter((wordInfo) => /^[a-zA-Z]{5}$/.test(wordInfo.word));

      const chosenWordInfo = random(frequentWords);
      const word = chosenWordInfo.word;
      if (word) {
        return this.encryption.encrypt(word);
      } else {
        console.debug(
          `No matches with search "${spelledLike}". Looking for another word.`
        );
      }
    }

    throw new Error(`Used all ${tries} tries and could not get a common word`);
  }

  getAnswer(answerKey: string): Promise<string | undefined> {
    return Promise.resolve(this.encryption.decrypt(answerKey));
  }

  private getRandomLetter() {
    const letters = "qwertyuiopasdfghjklzxcvbnm";
    return random(letters.split(""));
  }
}
