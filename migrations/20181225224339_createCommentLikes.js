
exports.up = function(knex, Promise) {
  return knex.schema.table('comments', table => {
      table.integer('likes').defaultTo(0);
  })
  .createTable('commentLikes', table => {
    table
      .integer('commentId')
      .unsigned()
      .references('id')
      .inTable('posts');
    table
      .integer('userId')
      .unsigned()
      .references('id')
      .inTable('users');
    table.timestamp('createdAt').defaultTo(knex.fn.now());
    table.primary('commentId', 'userId');
    table.index('commentId');
    table.index('userId');
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.table('comments', table => {
      table.dropColumn('likes');
  })
  .dropTableIfExists('commentLikes')
};
