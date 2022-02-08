import queryDist from "../assets/query-distribution.json";
import { WeightedDistribution } from "./weightedDistribution";

export function makeQueryGenerator() {
  const d = new WeightedDistribution(queryDist);
  return () => d.getRandom();
}
