// https://www-cs-faculty.stanford.edu/~knuth/sgb-words.txt
import fiveLetterWords from "./five-letter-words.json";
export { fiveLetterWords };

export async function getRandomWord(wordBank: string[]) {
  let tries = 0;
  while (tries < 10) {
    tries++;
    const testWord = chooseRandomWord(wordBank);
    if (await isAWord(testWord)) {
      return testWord;
    } else {
      console.warn(`"${testWord}" is not a word. Looking for another word.`);
    }
  }
}

function chooseRandomWord(words: string[]) {
  const index = Math.floor(words.length * Math.random());
  return words[index];
}

export async function isAWord(word: string) {
  if (!word) return false;
  const result = await fetch(
    `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`
  );
  return result.status === 200 || result.status === 304;
}
