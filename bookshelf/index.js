// Setting up the database connection
const knex = require('knex')({
    client: 'mysql',
    connection: {
      user: 'neomq',
      password:'Lazyapple123',
      database:'essential_oils'
    }
  })
  const bookshelf = require('bookshelf')(knex)
  
  module.exports = bookshelf;