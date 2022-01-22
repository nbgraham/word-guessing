/**
 * NOT cryptographically secure
 */
export class Encryption {
    cipher: Record<string, string> = {
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
    };
    reverseCipher = Object.keys(this.cipher).reduce(
      (rev, key) => ({ ...rev, [this.cipher[key]]: key }),
      {} as Record<string, string>
    );
  
    encrypt(answer: string) {
      return answer
        .toLowerCase()
        .split("")
        .map((letter) => this.cipher[letter])
        .reverse()
        .join("");
    }
  
    decrypt(encryptedAnswer: string) {
      return encryptedAnswer
        .toLowerCase()
        .split("")
        .map((letter) => this.reverseCipher[letter])
        .reverse()
        .join("");
    }
  }
  