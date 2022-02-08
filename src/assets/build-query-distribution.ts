// Not used at runtime, just historical record of how query-distribution.json was made
import wordBank from "./wordle-word-bank.json";

const letters = "qwertyuiopasdfghjklzxcvbnm";

export default function buildDistribution(length = 5) {
  const queries = getAllQueries(length);

  const matchCount = queries.reduce(
    (_matchCount, query) => ({
      ..._matchCount,
      [query]: getWordCountMatchingQuery(query) + 1, // Allow the possiblity to at least try each query
    }),
    {} as Record<string, number>
  );

  return matchCount;
}

function getAllQueries(length: number) {
  let queries = [];
  for (let i = 0; i < length; i++) {
    for (let letter of letters) {
      const query = new Array(length).fill("?");
      query[i] = letter;
      queries.push(query.join(""));
    }
  }
  return queries;
}

function getRegexFromQuery(query: string) {
  return new RegExp("^" + query.replaceAll("?", ".") + "$");
}

function getWordCountMatchingQuery(query: string) {
  const regex = getRegexFromQuery(query);
  return wordBank.words.filter((word) => regex.test(word)).length;
}
