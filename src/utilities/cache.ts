export class PromiseCache<T> {
  cache: Partial<Record<string, Promise<T>>> = {};

  get(key: string, factory: () => Promise<T>): Promise<T> {
    if (this.cache[key]) return this.cache[key]!;
    this.cache[key] = factory();
    return this.cache[key]!;
  }
}
