// Update with your config settings.

module.exports = {

    development: {
      client: 'postgresql',
      connection: {
        database: 'typefights',
        user:     'postgres',
        password: 'postgres'
      }
    },
  
    production: {
        client: 'postgresql',
        connection: process.env.DATABASE_URL + '?ssl=true'
    }
  };