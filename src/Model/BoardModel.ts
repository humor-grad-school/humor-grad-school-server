import { Model } from 'objection';
import PostModel from './PostModel';

export default class BoardModel extends Model {
  readonly id!: number;
  name!: string;
  createAt: Date;
  updateAt: Date;

  posts: PostModel[];

  static tableName = 'boards';

  static relationMappings = () => ({
    posts: {
      relation: Model.HasManyRelation,
      modelClass: PostModel,
      join: {
        from: 'boards.id',
        to: 'posts.boardId'
      },
    },
  });
}