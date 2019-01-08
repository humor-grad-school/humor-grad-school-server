exports.up = function (knex, Promise) {
  return knex.schema
    .createTable('boards', table => {
      table.increments('id').primary();
      table.string('name').notNullable().unique();
      table.timestamp('createdAt').notNullable().defaultTo(knex.fn.now());
      table.timestamp('updatedAt').notNullable().defaultTo(knex.raw('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'))
    })
    .table('posts', table => {
      table
        .integer('boardId')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('boards');
    });
};

exports.down = function (knex, Promise) {
  return knex.schema
    .table('posts', table => {
      table.dropForeign('boardId');
      table.dropColumn('boardId');
    })
    .dropTableIfExists('boards')
};
