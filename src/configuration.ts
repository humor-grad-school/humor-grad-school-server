import AWS from 'aws-sdk';
const credentials = new AWS.SharedIniFileCredentials({ profile: 'hgs' });
AWS.config.credentials = credentials;

const s3 = new AWS.S3({
  region: 'ap-northeast-2',
});

export class Configuration {
  FACEBOOK_SECRET_KEY: string;
  HGS_RDS_PASSWORD: string;
  BEFORE_ENCODING_S3_BUCKET = "before-encoding-s3-bucket";
  AFTER_ENCODING_S3_BUCKET = "after-encoding-s3-bucket";
  CONTENT_S3_BUCKET = "content-s3-bucket";
  S3_DEVELOPMENT_PORT = 9000;
  THUMBNAIL_S3_BUCKET = "hgs-thumbnail";
  AVATAR_S3_BUCKET = "hgs-avatar";
  avatarBaseUrl = "https://avatar.humorgrad.com";
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

  configuration = {
    ...new Configuration(),
    ...JSON.parse(body as string) as Configuration,
  };

  Object.entries(configuration).forEach(([key, value]) => {
    process.env[key] = value;
  });
  console.log('initConfiguration finished');
}

export function getConfiguration() {
  return configuration;
}
