// Update with your config settings.

module.exports = {

    development: {
        client: 'postgresql',
        connection: {
            database: process.env.DB_NAME,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD
        }
    },

    production: {
        client: 'postgresql',
        connection: {
            database: process.env.DB_NAME,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD
        }
    }
};