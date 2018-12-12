import ICache from "./ICache";

export default class MemoryCache<T> implements ICache<T> {
  private storage: { [key: string]: T } = {};
  async get(key: string): Promise<T> {
    return this.storage[key];
  }
  async set(key: string, value: T): Promise<void> {
    this.storage[key] = value;
  }
}