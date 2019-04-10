const Postgres = require('../lib/postgres');

const postgres = new Postgres();
const logger = require('../lib/logger');

/**
 *  Class contains all App Models
 *  Can be expanded and broken out as models expand.
 */ 
class Models {

  /**
   * Inserts job id and site into jobs table
   * @param {*} id - Job ID
   * @param {*} site - Website to be scraped.
   */
  async newJobModel(id, site) {
    const sql = `
    INSERT into html.jobs (id, site, status)
    VALUES ($1, $2, $3);
  `
    try {
      let newJob = await postgres.query(sql, [id, site, 'pending']);
      return newJob.rows[0];
    } catch (err) {
      logger.error(err);
    }
  }

  /**
   * 
   * @param {*} id - Job ID
   * @param {*} html - HTML results from website Scrape
   *  Inserts WebScraper results in job_results table.
   */
  async insertResults(id, html){
    const sql = `
    INSERT into html.job_results
    (job_id, job_return)
    VALUES ($1, $2);
    `; 
    try {
      let insert = await postgres.query(sql, [id, html]);
      return insert;
    } catch (err) {
      logger.error(err);
    }
  }

  /**
   * Updates Job Status in the DB
   * @param {*} id - Job ID
   * @param {*} status - Job Status
   */
  async updateStatus(id, status) {
    const sql = `
      UPDATE html.jobs
      SET status = $1
      WHERE id = $2;
    `
    try {
     let updatedStatus = await postgres.query(sql, [status, id]);
     return updatedStatus;
    } catch (err) {
      logger.error(err); 
    }
      }

  /**
   * Returns job results from job_results table
   * @param {*} id - Job ID
   */
  async resultModel(id) {
    const sql = `
      SELECT 
        j.site,
        j.status,
        jr.job_return
      FROM html.jobs j
      JOIN html.job_results jr on j.id = jr.job_id
      WHERE j.id = $1;
    `
    try {
     let results = await postgres.query(sql, [id]);
     return results.rows[0];
    } catch (err) {
      logger.error(err);
    }
  };


}

module.exports = Models;