
exports.up = function(knex, Promise) {
    return knex.schema.table('posts', table => {
        table.renameColumn('contentS3Id', 'contentS3Key');
    });
};

exports.down = function(knex, Promise) {
    return knex.schema.table('posts', table => {
        table.renameColumn('contentS3Key', 'contentS3Id');
    });
};
