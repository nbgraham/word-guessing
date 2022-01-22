import { Encryption } from "./encryption";

describe("encryption", () => {
  const encryption = new Encryption();

  function itSymetricallyEncrypts(
    expectedDecrypted: string,
    expectedEncrypted: string
  ) {
    it("encrypts", () => {
      const encrypted = encryption.encrypt(expectedEncrypted);
      expect(encrypted).toBe(expectedDecrypted);
    });

    it("decrypts", () => {
      const decrypted = encryption.decrypt(expectedDecrypted);
      expect(decrypted).toBe(expectedEncrypted);
    });
  }

  describe("heats", () => {
    itSymetricallyEncrypts("heats", "wgkuz");
  });

  describe("doubt", () => {
    itSymetricallyEncrypts("doubt", "glfsx");
  });
});
