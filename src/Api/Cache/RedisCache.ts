import redis, { RedisClient } from 'redis';
import ICache from "./ICache";

export default class RedisCache<T> implements ICache<T> {
  private client: RedisClient = redis.createClient();

  constructor() {
    this.client.on('error', (err) => {
      console.log('redis error : ', err);
    });
  }

  get(key: string): Promise<T> {
    return new Promise((resolve, reject) => {
      this.client.get(key, (err, reply) => {
        if (err) {
          return reject(err);
        }
        resolve(JSON.parse(reply));
      });
    });
  }
  set(key: string, value: T): Promise<void> {
    return new Promise((resolve, reject) => {
      this.client.set(key, JSON.stringify(value), (err, reply) => {
        if (err || reply != 'OK') {
          return reject(err);
        }
        resolve();
      });
    });
  }
}