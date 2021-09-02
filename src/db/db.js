// const knex = require('knex');
// const knexfile = require('./knexfile');

const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres',
  password: '123',
  host: 'localhost',
  port: 5433,
  database: 'medlink',

});

module.exports = pool;
