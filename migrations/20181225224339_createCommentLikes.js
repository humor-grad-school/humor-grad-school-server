
exports.up = function(knex, Promise) {
  return knex.schema.table('comments', table => {
      table.integer('likes').defaultTo(0);
  })
  .createTable('commentLikes', table => {
    table
      .integer('commentId')
      .unsigned();
    table
      .integer('userId')
      .unsigned();
    table.timestamp('createdAt').notNullable().defaultTo(knex.fn.now());
    table.primary('commentId', 'userId');
    table
      .foreign('commentId')
      .references('id')
      .inTable('posts');
    table
      .foreign('userId')
      .references('id')
      .inTable('users');
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
