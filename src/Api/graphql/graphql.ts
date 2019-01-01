import joinMonster from 'join-monster2';
import {
  GraphQLObjectType,
  GraphQLList,
  GraphQLString,
  GraphQLInt,
  GraphQLSchema
} from 'graphql'
import { knex } from '@/dbHelper';

const User = new GraphQLObjectType({
  name: 'User',
  uniqueKey: 'id',
  sqlTable: 'users',
  fields: () => ({
    id: {
      type: GraphQLInt,
    },
    username: {
      type: GraphQLString,
    },
    createAt: {
      type: GraphQLString,
    },
    posts: {
      type: new GraphQLList(Post),
      sqlJoin: (userTable, postTable) => `${userTable}.id = ${postTable}.writerId`,
    },
  }),
});


const Post = new GraphQLObjectType({
  name: 'Post',
  sqlTable: 'posts',
  uniqueKey: 'id',
  fields: () => ({
    id: {
      type: GraphQLInt,
    },
    title: {
      type: GraphQLString,
    },
    contentS3Key: {
      type: GraphQLString,
    },
    writer: {
      type: new GraphQLList(User),
      sqlJoin: (postTable, userTable) => `${postTable}.writerId = ${userTable}.id`,
    },
    board: {
      type: new GraphQLList(Board),
      sqlJoin: (postTable, boardTable) => `${postTable}.boardId = ${boardTable}.id`,
    },
    likes: {
      type: GraphQLInt,
    },
    comments: {
      type: new GraphQLList(Comment),
      sqlJoin: (postTable, commentTable) => `${postTable}.id = ${commentTable}.postId`,
    },
    createAt: {
      type: GraphQLString,
    },
    updatedAt: {
      type: GraphQLString,
    },
  }),
});

const Comment = new GraphQLObjectType({
  name: 'Comment',
  sqlTable: 'comments',
  uniqueKey: 'id',
  fields: () => ({
    id: {
      type: GraphQLInt,
    },
    writer: {
      type: new GraphQLList(User),
      sqlJoin: (commentTable, userTable) => `${commentTable}.writerId = ${userTable}.id`,
    },
    parentComment: {
      type: new GraphQLList(Comment),
      sqlJoin: (commentTable) => `${commentTable}.parentCommentId = ${commentTable}.id`,
    },
    contentS3Key: {
      type: GraphQLString,
    },
    likes: {
      type: GraphQLInt,
    },
    createAt: {
      type: GraphQLString,
    },
    updatedAt: {
      type: GraphQLString,
    },
  }),
});

const Board = new GraphQLObjectType({
  name: 'Board',
  sqlTable: 'boards',
  uniqueKey: 'id',
  fields: () => ({
    id: {
      type: GraphQLInt,
    },
    name: {
      type: GraphQLString,
    },
    posts: {
      type: new GraphQLList(Post),
      args: {
        page: {
          type: GraphQLInt,
        },
        pageSize: {
          type: GraphQLInt,
        },
      },
      limit: 5,
      orderBy: {
        id: 'desc',
      },
      sqlJoin: (boardTable, postTable) => `${boardTable}.id = ${postTable}.boardId`,
    },
    createAt: {
      type: GraphQLString,
    },
    updatedAt: {
      type: GraphQLString,
    },
  }),
});

export const Query = new GraphQLObjectType({
  name: 'Query',
  fields: () => ({
    user: {
      type: User,
      args: {
        id: { type: GraphQLInt }
      },
      where: (usersTable, args) => `${usersTable}.id = ${args.id}`,
      resolve: (parent, args, context, resolveInfo) => {
        return joinMonster(resolveInfo, {}, async sql => {
          const result = await knex.raw(sql);
          return result[0];
        }, {
          dialect: 'mariadb',
        });
      },
    },
    board: {
      type: Board,
      args: {
        name: { type: GraphQLString }
      },
      where: (usersTable, args) => `${usersTable}.name = "${args.name}"`,
      resolve: (parent, args, context, resolveInfo) => {
        return joinMonster(resolveInfo, {}, async sql => {
          console.log(sql);
          const result = await knex.raw(sql);
          return result[0];
        }, {
          dialect: 'mariadb',
        });
      },
    },
  }),
});

export const schema = new GraphQLSchema({
  query: Query,
});
