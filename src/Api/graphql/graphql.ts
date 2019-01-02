import joinMonster from 'join-monster2';
import {
  GraphQLObjectType,
  GraphQLList,
  GraphQLString,
  GraphQLInt,
  GraphQLSchema,
} from 'graphql'
import { knex } from '@/dbHelper';
import { GraphQLAllTypes } from '@/generated/graphql';



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
