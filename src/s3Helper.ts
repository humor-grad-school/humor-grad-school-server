import S3rver from 's3rver';
import config from '@/config.json';
import AWS from 'aws-sdk';

const uuid = require('uuid/v4');

const MB = 1024 * 1024;

class S3Helper {
  s3Server;
  s3: AWS.S3 = new AWS.S3();
  init() {
    if (process.env.NODE_ENV === 'development') {
      this.runS3DevelopmentServer(config.S3_DEVELOPMENT_PORT);
      const endpoint = new AWS.Endpoint(`localhost:${config.S3_DEVELOPMENT_PORT}`);
      this.s3.endpoint = endpoint;
    }
  }
  runS3DevelopmentServer(port) {
    const s3Server = new S3rver({
      port,
      hostname: 'localhost',
      silent: false,
      directory: '/tmp/s3rver'
    });
  }
  async createPresignedPost(sizeInMB: number): Promise<{ url: string, fields: { [key: string]: string }}> {
    const key = uuid();

    const params = {
      Bucket: 'twitch-channel-feed-media-before-encode',
      Conditions: [
        ['content-length-range', 0, sizeInMB * MB],
        {
          key,
        },
      ],
    };

    const {
      url,
      fields,
    } = await new Promise<AWS.S3.PresignedPost>((resolve, reject) => {
      this.s3.createPresignedPost(params, (err, data) => {
        if (err) {
          return reject(err);
        }
        resolve(data);
      });
    });

    return {
      url,
      fields
    };
  }
}

const s3Helper = new S3Helper();

export default s3Helper;
