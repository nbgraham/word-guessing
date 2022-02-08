import { WeightedDistribution } from "./weightedDistribution";
import { mockRandomForEach } from "../test_utils/randomMock";

mockRandomForEach("jsx");

it("always picks the only one with a value", () => {
  const d = new WeightedDistribution({
    hello: 1,
    nello: 0,
  });

  const sample = new Array(10).fill(null).map(() => d.getRandom());

  const tenHellos = new Array(10).fill(null).map(() => "hello");
  expect(sample).toEqual(tenHellos);
});

it("picks by weight", () => {
  const d = new WeightedDistribution({
    hello: 10,
    fish: 20,
    house: 30,
    nose: 40,
  });

  const sample = new Array(10000).fill(null).map(() => d.getRandom());

  const wordPercent = (word: string) =>
    sample.filter((s) => s === word).length / sample.length;

  expect(wordPercent("hello")).toBeCloseTo(0.1);
  expect(wordPercent("fish")).toBeCloseTo(0.2);
  expect(wordPercent("house")).toBeCloseTo(0.3);
  expect(wordPercent("nose")).toBeCloseTo(0.4);
});
