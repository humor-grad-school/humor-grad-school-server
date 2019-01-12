
exports.up = function (knex, Promise) {
  return knex.schema.table('commentLikes', table => {
    table.dropForeign('commentId');
    table
      .foreign('commentId')
      .references('id')
      .inTable('comments');
  });
};

exports.down = function (knex, Promise) {
  return knex.schema.table('commentLikes', table => {
    table.dropForeign('commentId');
    table
      .foreign('commentId')
      .references('id')
      .inTable('posts');
  });
};
