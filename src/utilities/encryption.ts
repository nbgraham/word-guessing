/**
 * NOT cryptographically secure
 * Just made to obscure the answer a bit in the URL
 * so that it doesn't give away anything obvious at a glance
 */
export class Encryption {
  encryptOperations: Operation[];
  decryptOperations: Operation[];

  constructor(version = 1) {
    const extraOps =
      version === 1
        ? [new Reverse()]
        : version === 2
        ? [new Shuffle([3, 2, 1, 4, 0]), new DynamicSlide()]
        : [];
    const operations = [
      ...extraOps,
      new Shift([12, 9, 4, 1, 13, 21]),
      new Cipher({
        q: "z",
        w: "s",
        e: "x",
        r: "c",
        t: "q",
        y: "l",
        u: "e",
        i: "m",
        o: "i",
        p: "g",
        a: "v",
        s: "o",
        d: "j",
        f: "u",
        g: "t",
        h: "n",
        j: "k",
        k: "a",
        l: "b",
        z: "h",
        x: "d",
        c: "y",
        v: "w",
        b: "f",
        n: "r",
        m: "p",
      }),
    ];

    this.encryptOperations = [...operations];
    this.decryptOperations = [...operations].reverse();
  }

  encrypt(answer: string) {
    const letters = answer.toLowerCase().split("");
    const encryptedLetters = this.encryptOperations.reduce(
      (word, operation) => operation.apply(word),
      letters
    );
    return encryptedLetters.join("");
  }

  decrypt(encryptedAnswer: string) {
    const letters = encryptedAnswer.toLowerCase().split("");
    const encryptedLetters = this.decryptOperations.reduce(
      (word, operation) => operation.revert(word),
      letters
    );
    return encryptedLetters.join("");
  }
}

type Word = string[];
export interface Operation {
  apply(word: Word): Word;
  revert(word: Word): Word;
}

class Shift implements Operation {
  letters = "qwertyuiopasdfghjklzxcvbnm";

  indexToShift: Array<number>;
  constructor(indexToShift: Array<number>) {
    this.indexToShift = indexToShift;
  }

  apply(word: Word): Word {
    this.validate(word);
    const shiftedNumbers = this.toNumbers(word).map(
      (letterIndex, wordIndex) => letterIndex + this.indexToShift[wordIndex]
    );
    return this.toWord(shiftedNumbers);
  }

  revert(word: Word): Word {
    this.validate(word);
    const unshiftedNumbers = this.toNumbers(word).map(
      (letterIndex, wordIndex) => letterIndex - this.indexToShift[wordIndex]
    );
    return this.toWord(unshiftedNumbers);
  }

  private validate(word: Word) {
    if (word.length > this.indexToShift.length)
      throw new Error(
        `This shift instance can only handle words up to ${this.indexToShift.length} characters. Cannot handle "${word}"`
      );
  }

  private toNumbers(word: Word): number[] {
    return word.map((letter) => this.letters.indexOf(letter));
  }

  private toWord(numbers: number[]): Word {
    return numbers
      .map((value) => mod(value, this.letters.length))
      .map((letterIndex) => this.letters[letterIndex]);
  }
}

class Cipher implements Operation {
  cipher: Record<string, string>;
  reverseCipher: Record<string, string>;

  constructor(cipher: Record<string, string>) {
    this.cipher = cipher;
    this.reverseCipher = Object.keys(cipher).reduce(
      (rev, key) => ({ ...rev, [cipher[key]]: key }),
      {} as Record<string, string>
    );
  }

  apply(word: Word): Word {
    return word.map((letter) => {
      if (this.cipher[letter]) return this.cipher[letter];
      throw new Error(`Unknown letter: "${letter}"`);
    });
  }
  revert(word: Word): Word {
    return word.map((letter) => {
      if (this.reverseCipher[letter]) return this.reverseCipher[letter];
      throw new Error(`Unknown letter: "${letter}"`);
    });
  }
}

export class DynamicSlide implements Operation {
  letters = "qwertyuiopasdfghjklzxcvbnm";

  apply(word: Word): Word {
    const slide = this.getWordSum(word);
    return word.map((_, i) => word[mod(i + slide, word.length)]);
  }
  revert(word: Word): Word {
    const slide = this.getWordSum(word);
    return word.map((_, i) => word[mod(i - slide, word.length)]);
  }

  private getWordSum(word: Word): number {
    return word
      .map((letter) => this.letters.indexOf(letter))
      .reduce((sum, v) => sum + v, 0);
  }
}

export class Shuffle implements Operation {
  newIndices: number[];
  reverseIndices: number[];

  constructor(newIndices: number[]) {
    newIndices.forEach((_, i) => {
      if (!newIndices.includes(i))
        throw new Error(
          `Shuffle indices did not include ${i}. Must include every index up to the length`
        );
    });
    this.newIndices = newIndices;
    this.reverseIndices = this.newIndices.map((_, i) =>
      this.newIndices.indexOf(i)
    );
  }

  apply(word: Word): Word {
    this.validate(word);
    return word.map((_, i) => word[this.newIndices[i]]);
  }
  revert(word: Word): Word {
    this.validate(word);
    return word.map((_, i) => word[this.reverseIndices[i]]);
  }

  private validate(word: Word) {
    if (word.length !== this.newIndices.length)
      throw new Error(
        `Can only shuffle words of length ${this.newIndices.length}`
      );
  }
}

/**
 * Always returns a positive result
 */
function mod(n: number, m: number) {
  return ((n % m) + m) % m;
}

class Reverse extends Shuffle {
  constructor() {
    super([4, 3, 2, 1, 0]);
  }
}
