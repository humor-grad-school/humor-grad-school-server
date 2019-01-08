
exports.up = function(knex, Promise) {
  return knex.schema.table('posts', table => {
      table.integer('likes').defaultTo(0);
  })
  .createTable('postLikes', table => {
    table
    .integer('postId')
    .unsigned();
    table
    .integer('userId')
    .unsigned();
    table.timestamp('createdAt').notNullable().defaultTo(knex.fn.now());
    table.primary('postId', 'userId');
    table
    .foreign('postId')
    .references('id')
    .inTable('posts');
    table
    .foreign('userId')
    .references('id')
    .inTable('users');
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
