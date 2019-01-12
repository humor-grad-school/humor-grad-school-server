import { Component, Vue } from 'vue-property-decorator';
import requestGraphqlQuery from '@/Api/requestGraphqlQuery';
import { request } from '@/test/test';
import uploadWithPresignedUrl from '@/Api/uploadWithPresignedUrl';

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
    const {
      url,
      fields,
      key,
    } = await request('user/avatar/presignedPost');

    console.log(file);

    const result = await uploadWithPresignedUrl(url, fields, key, file);
    console.log(result);
    await request('user/avatar', 'PUT', {
      key,
    });
    this.updateUserData();
  }
}
