import PostModel from '@/Model/PostModel';
import DataLoader from 'dataloader';
import wait from '@/utils/wait';
import { redisExistsAsync, redisSetnxAsync } from '@/RedisHelper';

// TODO : What I have to do with abnormal request? like a abusing?
export default class ViewCountService {
  private viewCountMap: { [postId: number]: number } = {};
  private viewCountLockPromise: Promise<void> = Promise.resolve();
  private savingProcessCount = 0;
  private postLoader = new DataLoader(async (postIds: number[]) => {
    const posts = await PostModel.query().findByIds(postIds);
    return postIds.map(postId => posts.find(post => post.id === postId));
  });

  private generateViewCountRedisKey(postId: number, ip: string, userId: number | undefined) {
    const key = `view-count-postId-${postId}-${userId ? `userId-${userId}` : `ip-${ip}`}`;
    return key;
  }

  async saveViewCount(postId: number, ip: string, userId: number | undefined) {
    await this.viewCountLockPromise;
    this.savingProcessCount += 1;

    try {
      if (this.viewCountMap[postId] === undefined) {
        const post = await this.postLoader.load(postId);

        if (!post) {
          console.log(`cannot find post but user request view count. postId: ${postId}`);
          return;
        }
        this.viewCountMap[postId] = 0;
      }

      const key = this.generateViewCountRedisKey(postId, ip, userId);

      // SET redis if not exists to
      const isNewView = await redisSetnxAsync(key, '1');
      if (!isNewView) {
        console.log('already viewed');
        return;
      }

      // Save to Memory
      this.viewCountMap[postId] += 1;

    } finally {
      this.savingProcessCount -= 1;
    }
  }

  private async waitUntilStopAllSaveProcess() {
    return new Promise(resolve => {
      const interval = setInterval(() => {
        if (this.savingProcessCount === 0) {
          clearInterval(interval);
          resolve();
        }
      }, 100);
    });
  }

  private async flushViewCountToDB() {
    this.viewCountLockPromise = new Promise(async (resolve) => {
      try {
        await this.waitUntilStopAllSaveProcess();
        await Promise.all(Object.entries(this.viewCountMap)
          .filter(([_, views]) => {
            return views > 0;
          })
          .map(async ([postId, views]) => {
            if (!views) {
              return;
            }
            try {
              console.log('postId', postId, 'views', views);
              await PostModel.query().where('id', postId).increment('views', views);
              this.viewCountMap[postId] = 0;
            } catch (err) {
              // is it really updated or not?
              // ASSUME that failed update
              console.error(err);
              return;
            }
          }));
      } finally {
        resolve();
      }
    });
  }

  async runFlushInterval() {
    await wait(1000);
    try {
      await this.flushViewCountToDB();
    } catch(err) {
      console.error(err);
    }
    this.runFlushInterval();
  }

  async isViewed(postId: number, ip: string, userId: number | undefined) {
    const key = this.generateViewCountRedisKey(postId, ip, userId);

    const isViewed = redisExistsAsync(key);
    return isViewed;
  }
}
