import { Model } from 'objection';
import UserModel from './UserModel';
import PostModel from './PostModel';

export default class CommentModel extends Model {
  readonly id!: number;
  writerId!: number;
  postId!: number;
  parentCommentId: number;
  contentS3Key!: string;
  likes: number;

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
    likers: {
      relation: Model.ManyToManyRelation,
      modelClass: UserModel,
      join: {
        from: 'comments.id',
        through: {
          from: 'commentLikes.commentId',
          to: 'commentLikes.userId',
        },
        to: 'users.id'
      }
    },
  });
}
