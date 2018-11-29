
exports.up = function(knex, Promise) {
    return knex.schema.table('posts', table => {
        table.string('contentS3Id').notNull().alter();
        table.string('title').notNull();
    });
};

exports.down = function(knex, Promise) {
    return knex.schema.table('posts', table => {
        table.dropColumn('contentS3Id');
        table.dropColumn('title');
    });
};
