
exports.up = function (knex, Promise) {
  return knex.schema
    .createTable('users', table => {
      table.increments('id').primary();
      table.string('username').unique();
    })
    .createTable('posts', table => {
      table.increments('id').primary();
      table.string('contentS3Id');
      table
        .integer('writerId')
        .unsigned()
        .references('id')
        .inTable('users');
    });
};

exports.down = function (knex, Promise) {
  return knex.schema
    .dropTableIfExists('posts')
    .dropTableIfExists('users');
};
