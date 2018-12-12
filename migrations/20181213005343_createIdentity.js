
exports.up = function(knex, Promise) {
  return knex.schema
  .createTable('identities', table => {
    table.string('id').primary();
    table
    .integer('userId')
    .unsigned()
    .references('id')
    .inTable('users');
    table.string('origin');
    table.timestamp('createdAt').defaultTo(knex.fn.now());
    table.timestamp('updatedAt').notNullable().defaultTo(knex.raw('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'))
  })
};

exports.down = function(knex, Promise) {
  return knex.schema
    .dropTableIfExists('identities')
};
