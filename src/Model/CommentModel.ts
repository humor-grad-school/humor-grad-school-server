import { Model } from 'objection';
import UserModel from './UserModel';
import PostModel from './PostModel';

export default class CommentModel extends Model {
  readonly id!: number;
  writerId!: number;
  postId!: number;
  parentCommentId: number;
  contentS3Key!: string;
  createAt: Date;
  updateAt: Date;

  static tableName = 'comments';

  static relationMappings = () => ({
    writer: {
      relation: Model.BelongsToOneRelation,
      modelClass: UserModel,
      join: {
        from: 'comments.writerId',
        to: 'users.id'
      },
    },
    post: {
      relation: Model.BelongsToOneRelation,
      modelClass: PostModel,
      join: {
        from: 'comments.postId',
        to: 'posts.id'
      },
    },
    parentComment: {
      relation: Model.HasManyRelation,
      modelClass: CommentModel,
      join: {
        from: 'comments.id',
        to: 'comments.parentCommentId',
      }
    },
  });
}
