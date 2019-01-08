
exports.up = function(knex, Promise) {
  return knex.schema.table('posts', table => {
      table.integer('views').unsigned().defaultTo(0);
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.table('posts', table => {
    table.dropColumn('views')
  });
};
