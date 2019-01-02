import { Model } from 'objection';
import UserModel from './UserModel';

export default class IdentityModel extends Model {
  readonly id!: string;
  userId?: number;
  origin?: string; // google, naver, kakao

  createdAt: Date;
  updatedAt: Date;

  private user: UserModel;
  public async getUser(): Promise<UserModel> {
    if (this.user) {
      return this.user;
    }
    const user = await UserModel.query().findById(this.userId);
    this.user = user;
    return user;
  }

  static tableName = 'identities';

  static relationMappings = () => ({
    user: {
      relation: Model.BelongsToOneRelation,
      modelClass: UserModel,
      join: {
        from: 'identities.userId',
        to: 'users.id',
      },
    },
  })
}
