import { Component, Vue } from 'vue-property-decorator';
import requestGraphqlQuery from '@/Api/requestGraphqlQuery';
import uploadWithPresignedUrl from '@/Api/uploadWithPresignedUrl';
import { HgsRestApi } from '@/Api/generated/client/ClientApis';

@Component({})
export default class Avatar extends Vue {
  public avatarUrl: string = '';
  public username: string = '';

  public async mounted() {
    this.updateUserData();
  }
  public async updateUserData() {
    const {
      me: {
        avatarUrl,
        username,
      },
    } = await requestGraphqlQuery(`
      {
        me {
          avatarUrl
          username
        }
      }
    `);
    this.username = username;
    this.avatarUrl = avatarUrl;
    console.log(username, avatarUrl);
  }
  public async fileChange(file: File) {
    const response = await HgsRestApi.requestPresignedPostFieldsForAvatar({}, {
    });

    const {
      url,
      fields,
      key,
    } = response.data;

    console.log(file);

    const result = await uploadWithPresignedUrl(url, fields, key, file);
    console.log(result);

    await HgsRestApi.updateAvatar({}, {
      key,
    });
    this.updateUserData();
  }
}
