import { Model } from 'objection';
import UserModel from './UserModel';
import CommentModel from './CommentModel';
import BoardModel from './BoardModel';

export default class PostModel extends Model {
  readonly id!: number;
  title!: string;
  contentS3Key!: string;
  writerId!: number;
  boardId!: number;
  likes: number;

  createAt: Date;
  updateAt: Date;

  writer: UserModel;

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
    board: {
      relation: Model.BelongsToOneRelation,
      modelClass: BoardModel,
      join: {
        from: 'posts.boardId',
        to: 'boards.id',
      },
    },
    likers: {
      relation: Model.ManyToManyRelation,
      modelClass: UserModel,
      join: {
        from: 'posts.id',
        through: {
          from: 'postLikes.postId',
          to: 'postLikes.userId',
        },
        to: 'users.id'
      }
    }
  });
}
