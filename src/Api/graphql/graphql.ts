import joinMonster from 'join-monster2';
import {
  GraphQLObjectType,
  GraphQLList,
  GraphQLString,
  GraphQLInt,
  GraphQLSchema,
  GraphQLBoolean,
  GraphQLObjectTypeConfig,
  GraphQLNonNull,
  GraphQLScalarType,
} from 'graphql'
import { knex } from '@/dbHelper';
import { GraphQLAllTypes } from '@/generated/graphql';
import { IRouterContext } from 'koa-router';
import ViewCountService from '../ViewCountService/ViewCountService';
import CommentModel from '@/Model/CommentModel';
import PostModel from '@/Model/PostModel';


const viewCountService = new ViewCountService();

const DateType = new GraphQLScalarType({
  name: 'Date',
  serialize: (value) => value,
});

const User = new GraphQLObjectType({
  name: 'User',
  uniqueKey: 'id',
  sqlTable: 'users',
  fields: () => ({
    id: {
      type: new GraphQLNonNull(GraphQLInt),
    },
    username: {
      type: new GraphQLNonNull(GraphQLString),
    },
    createdAt: {
      type: new GraphQLNonNull(DateType),
    },
    posts: {
      type: new GraphQLNonNull(new GraphQLList(Post)),
      sqlJoin: (userTable, postTable) => `${userTable}.id = ${postTable}.writerId`,
    },
    avatarUrl: {
      type: new GraphQLNonNull(GraphQLString),
    },
  }),
});

const Post = new GraphQLObjectType({
  name: 'Post',
  sqlTable: 'posts',
  uniqueKey: 'id',
  fields: () => ({
    id: {
      type: new GraphQLNonNull(GraphQLInt),
    },
    title: {
      type: new GraphQLNonNull(GraphQLString),
    },
    contentS3Key: {
      type: new GraphQLNonNull(GraphQLString),
    },
    writer: {
      type: new GraphQLNonNull(User),
      sqlJoin: (postTable, userTable) => `${postTable}.writerId = ${userTable}.id`,
    },
    board: {
      type: new GraphQLNonNull(Board),
      sqlJoin: (postTable, boardTable) => `${postTable}.boardId = ${boardTable}.id`,
    },
    likes: {
      type: new GraphQLNonNull(GraphQLInt),
    },
    isViewed: {
      type: new GraphQLNonNull(GraphQLBoolean),
      resolve({ id }, args, context) {
        // IP,
        // UserID
        const { ip, session } = context;
        const userId = session && session.userId;
        console.log(id, ip, session);

        return viewCountService.isViewed(id, ip, userId);
      },
    },
    views: {
      type: new GraphQLNonNull(GraphQLInt),
    },
    isLiked: {
      type: new GraphQLNonNull(GraphQLBoolean),
      sqlExpr: (postTable, args, context) => {
        if (!context.session) {
          return 'false';
        }
        const { userId } = context.session;

        return `EXISTS(
          SELECT 1
          FROM postLikes
          WHERE postLikes.postId = ${postTable}.id AND postLikes.userId = ${userId}
        )`;
      }
    },
    thumbnailUrl: {
      type: new GraphQLNonNull(GraphQLString),
    },
    comments: {
      type: new GraphQLNonNull(new GraphQLList(Comment)),
      sqlJoin: (postTable, commentTable) => `${postTable}.id = ${commentTable}.postId`,
    },
    commentCount: {
      type: new GraphQLNonNull(GraphQLInt),
      sqlExpr: (postTable, args, context) => {
        return `(
          SELECT COUNT(*)
          FROM ${CommentModel.tableName}
          WHERE ${CommentModel.tableName}.postId = ${postTable}.id
        )`;
      }
    },
    createdAt: {
      type: new GraphQLNonNull(DateType),
    },
    updatedAt: {
      type: new GraphQLNonNull(DateType),
    },
  }),
} as GraphQLObjectTypeConfig<any, IRouterContext>);

const Comment = new GraphQLObjectType({
  name: 'Comment',
  sqlTable: 'comments',
  uniqueKey: 'id',
  fields: () => ({
    id: {
      type: new GraphQLNonNull(GraphQLInt),
    },
    writer: {
      type: new GraphQLNonNull(User),
      sqlJoin: (commentTable, userTable) => `${commentTable}.writerId = ${userTable}.id`,
    },
    parentComment: {
      type: new GraphQLNonNull(Comment),
      sqlJoin: (commentTable) => `${commentTable}.parentCommentId = ${commentTable}.id`,
    },
    post : {
      type: new GraphQLNonNull(Post),
      sqlJoin: (commentTable, postTable) => `${commentTable}.postId = ${postTable}.id`,
    },
    contentS3Key: {
      type: new GraphQLNonNull(GraphQLString),
    },
    likes: {
      type: new GraphQLNonNull(GraphQLInt),
    },
    createdAt: {
      type: new GraphQLNonNull(DateType),
    },
    updatedAt: {
      type: new GraphQLNonNull(DateType),
    },
  }),
});

const Board = new GraphQLObjectType({
  name: 'Board',
  sqlTable: 'boards',
  uniqueKey: 'id',
  fields: () => ({
    id: {
      type: new GraphQLNonNull(GraphQLInt),
    },
    name: {
      type: new GraphQLNonNull(GraphQLString),
    },
    posts: {
      type: new GraphQLNonNull(new GraphQLList(Post)),
      args: {
        page: {
          type: new GraphQLNonNull(GraphQLInt),
        },
        pageSize: {
          type: new GraphQLNonNull(GraphQLInt),
        },
      },
      limit: 5,
      orderBy: {
        id: 'desc',
      },
      sqlJoin: (boardTable, postTable) => `${boardTable}.id = ${postTable}.boardId`,
    },
    createdAt: {
      type: new GraphQLNonNull(DateType),
    },
    updatedAt: {
      type: new GraphQLNonNull(DateType),
    },
  }),
});

export const Query = new GraphQLObjectType({
  name: 'Query',
  fields: () => ({
    user: {
      type: User,
      args: {
        id: { type: new GraphQLNonNull(GraphQLInt) },
      },
      where: (usersTable, args) => `${usersTable}.id = ${args.id}`,
      resolve: (parent, args, context, resolveInfo) => {
        return joinMonster(resolveInfo, context, async sql => {
          const result = await knex.raw(sql);
          return result[0];
        }, {
          dialect: 'mariadb',
        });
      },
    },
    me: {
      type: User,
      resolve: (parent, args, context, ...rest) => {
        if (!context.session) {
          throw new Error('login first please');
        }

        return Query.getFields().user.resolve(parent, {
          id: context.session.userId,
        },context, ...rest,);
      },
    },
    boards: {
      type: new GraphQLNonNull(new GraphQLList(Board)),
      resolve: (parent, args, context, resolveInfo) => {
        return joinMonster(resolveInfo, context, async sql => {
          console.log(sql);
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
        name: { type: new GraphQLNonNull(GraphQLString) },
      },
      where: (usersTable, args) => `${usersTable}.name = "${args.name}"`,
      resolve: (parent, args, context, resolveInfo) => {
        return joinMonster(resolveInfo, context, async sql => {
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

function getAllTypesOfSchema(schema: GraphQLSchema): Array<{ name: string; fields: Array<{ name: string; type: string }> }> {
  const queryType = schema.getTypeMap();
  return Object.entries(queryType)
    .filter(([key, value]) => value instanceof GraphQLObjectType && !key.startsWith('__'))
    .map(([key, value]) => travel(value as GraphQLObjectType));
}

function travel(object: GraphQLObjectType){
  const ret: any = {};
  ret.name = object.name;
  const fields = Object.entries(object.getFields()).map(([name, field]) => {
    return {
      name,
      type: field.type.toString(),
    };
  });

  ret.fields = fields;
  return ret;
}

const serverGraphQLAllTypes = getAllTypesOfSchema(schema);

function testSchema() {
  const errors: string[] = [];

  GraphQLAllTypes.forEach(type => {
    const sameServerType = serverGraphQLAllTypes.find((serverType) => serverType.name === type.name);
    if (!sameServerType) {
      errors.push(`cannot find type ${type.name}`);
      return;
    }

    type.fields.forEach((field) => {
      const serverField = sameServerType.fields.find((serverField) => serverField.name === field.name);
      if (!serverField) {
        errors.push(`cannot find field ${field.name} in type ${type.name}`);
        return;
      }
      if (field.type !== serverField.type) {
        errors.push(`in type ${type.name}, field ${field.name}: ${field.type} !== ${serverField.name}: ${serverField.type}`);
        return;
      }
    });

    const unknownFields = sameServerType.fields.filter((serverField) => type.fields.every(field => field.name !== serverField.name));
    if (unknownFields.length) {
      errors.push(`in type ${type.name}, unknown fields - ${unknownFields.map(field => `${field.name}: ${field.type}`).join(', ')}`);
      return;
    }
  });
  const unknownTypes = serverGraphQLAllTypes.filter((serverType) => GraphQLAllTypes.every(type => type.name !== serverType.name));
  if (unknownTypes.length) {
    errors.push(`unknown types - ${unknownTypes.map(field => `${field.name}`).join(', ')}`);
  }

  if (errors.length) {
    throw new Error(`graphql schema test failed : ${errors.join('\n')}`);
  }
}

testSchema();
