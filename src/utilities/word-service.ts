export async function isAWord(word: string) {
  if (!word) return false;
  const result = await fetch(
    `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`
  );
  return result.status === 200 || result.status === 304;
}
