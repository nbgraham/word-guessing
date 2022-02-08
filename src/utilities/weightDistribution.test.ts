import { WeightedDistribution } from "./weightedDistribution";
import { mockRandomForEach } from "../test_utils/randomMock";

describe("weighted distribution", () => {
  const pickSample = (d: WeightedDistribution, size: number) => {
    const data = new Array(size).fill(null).map(() => d.getRandom());
    return {
      wordPercent: (word: string) =>
        data.filter((s) => s === word).length / data.length,
    };
  };

  mockRandomForEach("random");

  it("always picks the only one with a value", () => {
    const d = new WeightedDistribution({
      hello: 1,
      nello: 0,
    });

    const sample = pickSample(d, 100);

    expect(sample.wordPercent("hello")).toBe(1);
  });

  it("picks by weight", () => {
    const d = new WeightedDistribution({
      hello: 10,
      fish: 20,
      house: 30,
      nose: 40,
    });

    const sample = pickSample(d, 10000);

    expect(sample.wordPercent("hello")).toBeCloseTo(0.1);
    expect(sample.wordPercent("fish")).toBeCloseTo(0.2);
    expect(sample.wordPercent("house")).toBeCloseTo(0.3);
    expect(sample.wordPercent("nose")).toBeCloseTo(0.4);
  });
});
