export default interface ICache<T> {
  get(key: string): Promise<T>;
  set(key: string, value: T): Promise<void>;
}
// TODO : Add TTL