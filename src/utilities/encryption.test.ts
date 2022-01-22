import { Encryption } from "./encryption";

describe("encryption", () => {
  const encryption = new Encryption();

  function itSymetricallyEncrypts(
    baseWord: string,
    expectedEncrypted: string
  ) {
    it("encrypts", () => {
      const encrypted = encryption.encrypt(baseWord);
      expect(encrypted).toBe(expectedEncrypted);
    });

    it("decrypts", () => {
      const decrypted = encryption.decrypt(expectedEncrypted);
      expect(decrypted).toBe(baseWord);
    });
  }

  describe("heats", () => {
    itSymetricallyEncrypts("heats", "futcx");
  });

  describe("doubt", () => {
    itSymetricallyEncrypts("doubt", "kevgp");
  });

  describe("stoop: obscures double letters", () => {
    itSymetricallyEncrypts("stoop", "yajlr");
  });
});
