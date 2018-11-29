import { Model } from 'objection';
import UserModel from './UserModel';

export default class PostModel extends Model {
  readonly id!: number;
  title!: string;
  contentS3Key!: string;
  writer!: UserModel;

  static tableName = 'posts';

  relationMappings = () => ({
    writer: {
      relation: Model.BelongsToOneRelation,
      modelClass: UserModel,
      join: {
        from: 'posts.writerId',
        to: 'user.id'
      },
    },
  });
}
