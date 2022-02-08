import { random } from "../utilities/array";
import { WORD_LENGTH } from "../utilities/contants";
import { Encryption } from "../utilities/encryption";
import { makeQueryGenerator } from "../utilities/query-generator";
import { VersionKey, WordBank, WordValidator } from "../utilities/types";
import { datamuseApi } from "./datamuse-api";

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
  private getWordBank: () => Promise<WordBank>;

  constructor(
    version: VersionKey,
    wordValidator: WordValidator,
    getWordBank: () => Promise<WordBank>
  ) {
    super(version);
    this.wordValidator = wordValidator;
    this.getWordBank = getWordBank;
  }

  async getNewAnswerKey(mustBeValidWord: boolean): Promise<string | undefined> {
    const wordBank = await this.getWordBank();
    const words = wordBank.words;

    let tries = 0;
    while (tries < 10) {
      tries++;

      const index = Math.floor(words.length * Math.random());
      const word = words[index];

      const valid =
        !mustBeValidWord || (await this.wordValidator.isValidAnswer(word));
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
}

export class DatamuseApiAnswerService extends AnswerService {
  encryption: Encryption;
  minFrequency = 10;
  queryGenerator: () => string;
  wordRegex = new RegExp(`^[a-zA-Z]{${WORD_LENGTH}}$`);

  constructor(version: VersionKey, encryption: Encryption) {
    super(version);
    this.encryption = encryption;
    this.queryGenerator = makeQueryGenerator();
  }

  async getNewAnswerKey(): Promise<string | undefined> {
    let tries = 0;
    while (tries < 10) {
      tries++;

      const spelledLike = this.queryGenerator();

      const wordsInfo = await datamuseApi.getWordsInfo({
        spelledLike,
        max: 100,
        metadata: {
          frequency: true,
          definitions: true,
        },
      });

      const frequentWords = wordsInfo
        .filter((wordInfo) => (wordInfo.defs || []).length > 0)
        .filter(
          (wordInfo) =>
            wordInfo.frequency && wordInfo.frequency > this.minFrequency
        )
        .filter((wordInfo) => this.wordRegex.test(wordInfo.word));

      const chosenWordInfo = random(frequentWords);
      const word = chosenWordInfo?.word;
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
