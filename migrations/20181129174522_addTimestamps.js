
exports.up = function(knex, Promise) {
    return knex.schema.table('posts', table => {
        table.timestamp('createdAt').notNullable().defaultTo(knex.fn.now());
        table.timestamp('updatedAt').notNullable().defaultTo(knex.raw('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'))
    })
    .table('users', table => {
        table.timestamp('createdAt').notNullable().defaultTo(knex.fn.now());
        table.timestamp('updatedAt').notNullable().defaultTo(knex.raw('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'))
    });
};

exports.down = function(knex, Promise) {
    return knex.schema.table('posts', table => {
        table.dropColumn('createdAt');
        table.dropColumn('updatedAt');
    })
    .table('users', table => {
        table.dropColumn('createdAt');
        table.dropColumn('updatedAt');
    });
};
