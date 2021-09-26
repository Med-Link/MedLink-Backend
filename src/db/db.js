const knex = require('knex');
const { Pool } = require('pg');
const knexfile = require('./knexfile');

// const pool = new Pool({
//   user: 'postgres',
//   password: 'abcd1234',
//   host: 'localhost',
//   port: 5432,
//   database: 'medlink',

// });
const pool = new Pool({
  user: 'aeeurajvblzrqz',
  password: '186bdc04eead08fda182f5eafb5306df3112b2e2ac8388cd3afac47eb0d2ebbd',
  host: 'ec2-44-195-201-3.compute-1.amazonaws.com',
  port: 5432,
  database: 'dk5206v3k9k8o',

});
// const pool = process.env.DATABASE_URL;
module.exports = pool;
