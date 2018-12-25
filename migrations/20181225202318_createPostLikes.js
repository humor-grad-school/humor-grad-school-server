
exports.up = function(knex, Promise) {
  return knex.schema.table('posts', table => {
      table.integer('likes').defaultTo(0);
  })
  .createTable('postLikes', table => {
    table
    .integer('postId')
    .unsigned()
    .references('id')
    .inTable('posts');
    table
    .integer('userId')
    .unsigned()
    .references('id')
    .inTable('users');
    table.timestamp('createdAt').defaultTo(knex.fn.now());
    table.primary('postId', 'userId');
    table.index('postId');
    table.index('userId');
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.table('posts', table => {
      table.dropColumn('likes');
  })
  .dropTableIfExists('postLikes')
};
