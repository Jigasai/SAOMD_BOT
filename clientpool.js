var pg = require('pg');

var config = {
  user: 'iydakmxsuzuqdr',
  database: 'd2thn0omjj1r2r',
  password: 'f999d12c7888308d8ed598e12d2cf500c379ec85ea54cbe85c2550a62bf07e3',
  host: 'ec2-176-34-113-195.eu-west-1.compute.amazonaws.com',
  port: 5432,
  max: 10,
  idleTimeoutMillis: 50000,
};

var pool = new pg.Pool(config);
module.exports = pool;

