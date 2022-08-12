const knex = require('knex')({
    client: 'mysql',
    connection: {
        user: 'admin',
        password: 'password',
        database: 'wallStyle'
    }
})

const bookshelf = require('bookshelf')(knex)
module.exports = bookshelf