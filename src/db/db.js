// const knex = require('knex');
// const knexfile = require('./knexfile');

// const { Pool } = require('pg');

// const pool = new Pool({
//   user: 'postgres',
//   password: 'abcd1234',
//   host: 'localhost',
//   port: 5432,
//   database: 'medlink',

// });
const pool = process.env.DATABASE_URL;
module.exports = pool;
