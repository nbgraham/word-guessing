export class WeightedDistribution {
  line: [number, string][];
  total: number;

  constructor(distribution: Record<string, number>) {
    this.line = [];
    let agg = 0;
    for (const [word, weight] of Object.entries(distribution)) {
      agg += weight;
      this.line.push([agg, word]);
    }
    this.total = agg;
  }

  getRandom(): string {
    const point = Math.random() * this.total;
    const match = this.line.find(([n]) => n > point);
    return match![1];
  }
}
