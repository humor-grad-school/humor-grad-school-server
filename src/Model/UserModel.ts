import { Model } from 'objection';
import PostModel from './PostModel';

export default class UserModel extends Model {
  readonly id!: number;
  username!: string;
  createdAt: Date;
  updatedAt: Date;

  static tableName = 'users';

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
