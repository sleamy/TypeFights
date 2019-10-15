// username - text
// email - text
// password - text
// fights - int
// rating - int
// wins - int
// losses - int
// joined - date

exports.up = function (knex, Promise) {
    return knex.schema.createTable('fighter', (table) => {
        table.increments()
        table.text('username').notNullable()
        table.text('email').notNullable()
        table.text('password').notNullable()
        table.integer('fights').defaultTo(0).notNullable()
        table.integer('wins').defaultTo(0).notNullable()
        table.integer('losses').defaultTo(0).notNullable()
        table.integer('rating').defaultTo(1000).notNullable()
        table.datetime('joined').notNullable()
    })
};

exports.down = function (knex, Promise) {
    return knex.schema.dropTable('fighter')
};
