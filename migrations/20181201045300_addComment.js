exports.up = function (knex, Promise) {
  return knex.schema.createTable('comments', table => {
    table.increments('id').primary();
    table
      .integer('writerId')
      .unsigned()
      .references('id')
      .inTable('users');
    table
      .integer('postId')
      .unsigned()
      .references('id')
      .inTable('users');
    table
      .integer('parentCommentId')
      .unsigned()
      .references('id')
      .inTable('comments');

    table.string('contentS3Key').notNullable();

    table.timestamp('createdAt').defaultTo(knex.fn.now());
    table.timestamp('updatedAt').notNullable().defaultTo(knex.raw('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'))
  });
};

exports.down = function (knex, Promise) {
  return knex.schema
    .dropTableIfExists('comments')
};



