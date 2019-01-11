import redis, { RedisClient } from 'redis';
import { isDevelopment } from '.';

export const redisClient: RedisClient = redis.createClient({
  host: isDevelopment ? '127.0.0.1' : 'hgs-reids-cluster.uzuxys.clustercfg.apn2.cache.amazonaws.com',
});


function promisifyOneArgs<T1, R>(func: (args: T1, callback: redis.Callback<R>) => void) {
  return (args: T1) => {
    return new Promise((resolve, reject) => {
      func.bind(redisClient)(args, (err: Error | null, reply: R) => {
        err ? reject(err) : resolve(reply);
      });
    })
  }
}

function promisifyTwoArgs<T1, T2, R>(func: (args1: T1, args2: T2, callback: redis.Callback<R>) => void) {
  return (args1: T1, args2: T2) => {
    return new Promise((resolve, reject) => {
      func.bind(redisClient)(args1, args2, (err: Error | null, reply: R) => {
        err ? reject(err) : resolve(reply);
      });
    })
  }
}


export const redisGetAsync = promisifyOneArgs(redisClient.get);
export const redisExistsAsync = promisifyOneArgs(redisClient.exists);
export const redisSetnxAsync = promisifyTwoArgs(redisClient.setnx);
