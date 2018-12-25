
exports.up = function(knex, Promise) {
  return knex.schema.table('comments', table => {
    table.dropForeign('postId');
    table.foreign('postId').references('posts.id');
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.table('comments', table => {
    table.dropForeign('postId');
    table.foreign('postId').references('users.id');
  });
};
