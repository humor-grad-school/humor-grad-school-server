import redis, { RedisClient } from 'redis';
import { isDevelopment } from '.';

export const redisClient: RedisClient = redis.createClient({
  host: isDevelopment ? '127.0.0.1' : 'hgs-dev-redis.kj72ta.ng.0001.apn2.cache.amazonaws.com',
});
