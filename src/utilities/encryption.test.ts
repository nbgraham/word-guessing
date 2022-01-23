import { DynamicSlide, Encryption, Operation, Shuffle } from "./encryption";

describe("encryption", () => {
  const makeSymetricallyEncrypts =
    (encryption: Encryption) =>
    (baseWord: string, expectedEncrypted: string) => {
      it("encrypts", () => {
        const encrypted = encryption.encrypt(baseWord);
        expect(encrypted).toBe(expectedEncrypted);
      });

      it("decrypts", () => {
        const decrypted = encryption.decrypt(expectedEncrypted);
        expect(decrypted).toBe(baseWord);
      });
    };

  describe("v1", () => {
    const encryptionV1 = new Encryption(1);
    const itSymetricallyEncrypts = makeSymetricallyEncrypts(encryptionV1);

    describe("heats", () => {
      itSymetricallyEncrypts("heats", "futcx");
    });

    describe("doubt", () => {
      itSymetricallyEncrypts("doubt", "kevgp");
    });

    describe("obscures double letters", () => {
      itSymetricallyEncrypts("stoop", "yajlr");
    });

    describe("first letter 'h' always corresponds to the 'x' last letter", () => {
      itSymetricallyEncrypts("heart", "kjtcx");
      itSymetricallyEncrypts("hears", "fjtcx");
    });
  });

  describe("v2", () => {
    const encryptionV2 = new Encryption(2);
    const itSymetricallyEncrypts = makeSymetricallyEncrypts(encryptionV2);

    describe("heats", () => {
      itSymetricallyEncrypts("heats", "tdhlf");
    });

    describe("doubt", () => {
      itSymetricallyEncrypts("doubt", "kysmy");
    });

    describe("obscures double letters", () => {
      itSymetricallyEncrypts("stoop", "daivr");
    });

    describe("first letter 'h' does not always correspond to the same letter in any fixed position", () => {
      itSymetricallyEncrypts("heart", "sjtca");
      itSymetricallyEncrypts("hears", "wonkk");
    });
  });
});

describe("operations", () => {
  function encryptsTo(operation: Operation, plain: string, cipher: string) {
    const encrypted = operation.apply(plain.split(""));
    expect(encrypted.join("")).toEqual(cipher);
    const reverted = operation.revert(encrypted);
    expect(reverted.join("")).toEqual(plain);
  }

  describe("dynamic slide", () => {
    it("slides by different amounts", () => {
      const slide = new DynamicSlide();

      encryptsTo(slide, "heart", "thear");
      encryptsTo(slide, "hears", "earsh");
    });
  });

  describe("shuffle", () => {
    it("shuffles", () => {
      const shuffle = new Shuffle([3, 2, 1, 4, 0]);
      encryptsTo(shuffle, "pipes", "episp");
    });

    it("validates indices", () => {
      expect(() => new Shuffle([13, 3, 0])).toThrow();
    });
  });
});
