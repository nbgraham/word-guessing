/**
 * NOT cryptographically secure
 */
export class Encryption {
  encryptOperations: Operation[];
  decryptOperations: Operation[];

  constructor() {
    const operations = [
      new Reverse(),
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
interface Operation {
  apply(word: Word): Word;
  revert(word: Word): Word;
}

class Reverse implements Operation {
  apply(word: Word): Word {
    return [...word].reverse();
  }
  revert(word: Word): Word {
    return [...word].reverse();
  }
}

class Shift implements Operation {
  indexToShift: Array<number>;
  letters = "qwertyuiopasdfghjklzxcvbnm";

  constructor(indexToShift: Array<number>) {
    this.indexToShift = indexToShift;
  }

  apply(word: Word): Word {
    return word
      .map((letter) => this.letters.indexOf(letter))
      .map(
        (letterIndex, wordIndex) =>
          (letterIndex + this.indexToShift[wordIndex]) % this.letters.length
      )
      .map((letterIndex) => this.letters[letterIndex]);
  }
  revert(word: Word): Word {
    return word
      .map((letter) => this.letters.indexOf(letter))
      .map(
        (letterIndex, wordIndex) =>
          (letterIndex - this.indexToShift[wordIndex] + this.letters.length) % this.letters.length
      )
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
    return word.map((letter) => this.cipher[letter]);
  }
  revert(word: Word): Word {
    return word.map((letter) => this.reverseCipher[letter]);
  }
}
