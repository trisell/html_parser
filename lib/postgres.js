//External Import
const Pool = require('pg').Pool
//Internal Imports
const config = require('../config');
const logger = require('../lib/logger');

/**
 * Postgres class contains connector for SQL DB
 * Creates pool and has query function. Can be expanded as 
 * needed with more DB connection or query needs.
 */
module.exports = class Postgres {
  constructor(
) {
  try {
    this.pool = new Pool(config.postgres);
  } catch (err) {
    logger.error(err);
  }
  };

  query(sql, args, callback) {
    return this.pool.query(sql, args, callback);
  };

};
