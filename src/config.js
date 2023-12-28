const dotenv = require('dotenv');

dotenv.config();

const config = {
  app: {
    host: process.env.APP_HOST ?? 'localhost',
    port: process.env.APP_PORT ?? 5000,
  },
  postgres: {
    host: process.env.PGHOST ?? 'localhost',
    port: process.env.PGPORT ?? 5432,
    user: process.env.PGUSER ?? 'postgres',
    password: process.env.PGPASSWORD,
    database: process.env.PGDATABASE ?? 'postgres',
  },
};

module.exports = { config };
