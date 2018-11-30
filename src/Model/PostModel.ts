import { Model } from 'objection';
import UserModel from './UserModel';
import CommentModel from './CommentModel';

export default class PostModel extends Model {
  readonly id!: number;
  title!: string;
  contentS3Key!: string;
  writer!: UserModel;
  createAt: Date;
  updateAt: Date;

  comments: CommentModel[];

  static tableName = 'posts';

  static relationMappings = () => ({
    writer: {
      relation: Model.BelongsToOneRelation,
      modelClass: UserModel,
      join: {
        from: 'posts.writerId',
        to: 'users.id'
      },
    },
    comments: {
      relation: Model.HasManyRelation,
      modelClass: CommentModel,
      join: {
        from: 'posts.id',
        to: 'comments.writerId',
      },
    },
  });
}
