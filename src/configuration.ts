import AWS from 'aws-sdk';

const s3 = new AWS.S3({
  region: 'ap-northeast-2',
});

export type Configuration = {
  FACEBOOK_SECRET_KEY: string;
  HGS_RDS_PASSWORD: string;
}

let configuration: Configuration = undefined;

export async function initConfiguration() {
  console.log('start initConfiguration');
  const params = {
    Bucket: 'hgs-configuration',
    Key: 'config.json',
    ResponseContentType: 'applicaiton/json',
  };
  const { Body: body } = await s3.getObject(params).promise();

  configuration = JSON.parse(body as string) as Configuration;

  Object.entries(configuration).forEach(([key, value]) => {
    process.env[key] = value;
  });
  console.log('initConfiguration finished');
}

export function getConfiguration() {
  return configuration;
}
