import MemoryCache from "./MemoryCache";
import RedisCache from "./RedisCache";
import ICache from "./ICache";
import { Session } from "../types/generated/server/ServerBaseApiRouter";

class SessionCacheService implements ICache<Session> {
  private memoryCache = new MemoryCache<Session>();
  private redisCache = new RedisCache<Session>();

  async get(key: string): Promise<Session> {
    const valueInMemory = await this.memoryCache.get(key);
    if (valueInMemory) {
      return valueInMemory;
    }

    const valueInRedis = await this.redisCache.get(key);
    await this.memoryCache.set(key, valueInRedis);
    return valueInRedis;
  }
  async set(key: string, value: Session): Promise<void> {
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
