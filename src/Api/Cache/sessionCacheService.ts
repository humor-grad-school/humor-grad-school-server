import MemoryCache from "./MemoryCache";
import RedisCache from "./RedisCache";
import ICache from "./ICache";

export interface ISession {
  userId: number;
}

class SessionCacheService implements ICache<ISession> {
  private memoryCache = new MemoryCache<ISession>();
  private redisCache = new RedisCache<ISession>();

  async get(key: string): Promise<ISession> {
    const valueInMemory = await this.memoryCache.get(key);
    if (valueInMemory) {
      return valueInMemory;
    }

    const valueInRedis = await this.redisCache.get(key);
    await this.memoryCache.set(key, valueInRedis);
    return valueInRedis;
  }
  async set(key: string, value: ISession): Promise<void> {
    try {
      await this.memoryCache.set(key, value);
    } catch(err) {
      // it's ok :D
    }
    await this.redisCache.set(key, value);
  }
}

const sessionCacheService = new SessionCacheService();
export default sessionCacheService;