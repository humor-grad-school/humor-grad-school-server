import { Model } from 'objection';
import PostModel from './PostModel';

export default class UserModel extends Model {
  readonly id!: number;
  username!: string;

  static tableName = 'users';

  relationMappings = () => ({
    posts: {
      relation: Model.HasManyRelation,
      modelClass: PostModel,
      join: {
        from: 'users.id',
        to: 'posts.writerId',
      },
    },
  })
}
