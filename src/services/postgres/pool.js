const { Pool } = require('pg');
const config = require('../../config');

function createPool() {
  return new Pool({
    host: config.postgres.host,
    port: config.postgres.port,
    user: config.postgres.user,
    password: config.postgres.password,
    database: config.postgres.database,
  });
}

const pool = createPool();

module.exports = pool;
