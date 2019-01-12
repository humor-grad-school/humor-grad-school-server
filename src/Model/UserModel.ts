import { Model } from 'objection';
import PostModel from './PostModel';

export default class UserModel extends Model {
  readonly id!: number;
  username!: string;
  avatarUrl!: string;
  createdAt: Date;
  updatedAt: Date;

  static tableName = 'users';

  static defaultAvatarUrl = 'https://avatar.humorgrad.com/default.png';
  static avatarSizeLimit = 10 * 1000 * 1000;

  static relationMappings = () => ({
    posts: {
      relation: Model.HasManyRelation,
      modelClass: PostModel,
      join: {
        from: 'users.id',
        to: 'posts.writerId',
      },
    },
  });
}
