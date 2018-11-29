import config from '@/config.json';
import AWS from 'aws-sdk';
import { execFile } from 'child_process';

const uuid = require('uuid/v4');

const MB = 1024 * 1024;

const isDevelopment = process.env.NODE_ENV === 'development';

export const s3 = isDevelopment
  ? new AWS.S3({
    accessKeyId: '123',
    secretAccessKey: '12345678',
    endpoint: 'http://127.0.0.1:9000',
    s3ForcePathStyle: true, // needed with minio?
    signatureVersion: 'v4'
  })
  : new AWS.S3();

class S3Helper {
  async init() {
    if (isDevelopment) {
      const buckets = [
        config.BEFORE_ENCODING_S3_BUCKET,
        config.AFTER_ENCODING_S3_BUCKET,
        config.CONTENT_S3_BUCKET,
      ];
      await Promise.all(buckets.map(async bucket => {
        const isExists = await this.checkBucketExists(bucket);
        if (isExists) {
          return;
        }
        await this.createBucket(bucket);
        await this.makeBucketPublic(bucket);
      }));
    }
  }
  async createPresignedPost(sizeInMB: number, bucketName: string): Promise<{ url: string, fields: { [key: string]: string }, key: string }> {
    const key = uuid();

    const params = {
      Bucket: bucketName,
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
      s3.createPresignedPost(params, (err, data) => {
        if (err) {
          return reject(err);
        }
        resolve(data);
      });
    });

    return {
      url,
      fields,
      key,
    };
  }
  async checkBucketExists(bucket) {
    const params = {
      Bucket: bucket
    };
    try {
      await s3.headBucket(params).promise();
      return true;
    } catch (err) {
      if (err.code === 'NotFound') {
        return false;
      }
      throw err;
    }
  }
  async createBucket(bucket: string) {
    console.log('createBucket : ', bucket);
    const params = {
      Bucket: bucket,
    };
    await s3.createBucket(params).promise();
  }
  async makeBucketPublic(bucket: string) {
    console.log('makeBucketPublic : ', bucket);
    const params = {
      Bucket: bucket,
      Policy: JSON.stringify({
        "Version": "2012-10-17",
        "Statement": [
          {
            "Effect": "Allow",
            "Principal": "*",
            "Action": "s3:GetObject",
            "Resource": `arn:aws:s3:::${bucket}/*`
          }
        ]
      })
    };
    await s3.putBucketPolicy(params).promise();
  }
}

const s3Helper = new S3Helper();

export default s3Helper;
