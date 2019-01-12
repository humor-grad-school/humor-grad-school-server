
exports.up = function (knex, Promise) {
  return knex.schema.table('users', table => {
    table.string('avatarUrl').notNullable();
  }).table('posts', table => {
    table.string('thumbnailUrl').notNullable();
  });
};

exports.down = function (knex, Promise) {
  return knex.schema.table('users', table => {
    table.dropColumn('avatarUrl')
  }).table('posts', table => {
    table.dropColumn('thumbnailUrl')
  });
};
