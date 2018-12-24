import AWS from 'aws-sdk';

const s3 = new AWS.S3();

export type Configuration = {
  FACEBOOK_SECRET_KEY: string;
}

let configuration: Configuration = undefined;

export async function initConfiguration() {
  const params = {
    Bucket: 'humor-grad-school-configuration',
    Key: 'config.json',
    ResponseContentType: 'applicaiton/json',
  };
  const { Body: body } = await s3.getObject(params).promise();

  configuration = JSON.parse(body as string) as Configuration;
}

export function getConfiguration() {
  return configuration;
}
