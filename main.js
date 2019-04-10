// External Package Imports
const express = require('express');
const bodyParser = require('body-parser');
const kue = require('kue');
const router = module.exports = express();

// Internal Imports
const config = require('./config');
const logger = require('./lib/logger');
const Models = require('./models/models');
const Postgres = require('./lib/postgres');
const webScraper = require('./lib/worker');
const postgres = new Postgres();

const models = new Models();

// Create the job queue using redis
const queue = kue.createQueue({
  redis: config.redis,
});


// Simple middleware to log all router requests if in dev mode.
router.use((req, res, next) => {
  if ( config.env === 'dev' || process.env.NODE_ENV == 'dev')
  logger.info(`${req.method} ${req.path}`);
  next();
});

// Body parser to get json from body.
router.use(bodyParser.urlencoded({
  extended: true
}))

router.use(bodyParser.json())


/*
* API Route for creating new html site scrapping job.
* Pass a valid http or https address via JSON in the body.
* EXP:
* {
*   site: "https://google.com" 
* } 
* Returns a job ID that can be used to follow the job and get the job results.
* Return EXP:
* {
*   "id": "100"
* }
*/
router.post('/new', (req, res) => {
  // Verify that req.body.site contains a site
  if (req.body.site !== undefined || req.body.site !== null){
    const httpCheck = new RegExp('^(http|https)://')
    // Check that site contains http or https
    if (!httpCheck.test(req.body.site)){
      res.status(500).json({
        error: "Please include either http:// or https:// in your site request."
      });
    } else{ 
      let newJob;
      try {
        // Takes site request and adds it to jobs queue
        newJob = queue.create('jobs', {
          site: req.body.site,
        }).save( async (err) =>{
          if (err) logger.error(err);
          //Add job to DB for future reference
          await models.newJobModel(newJob.id, req.body.site);
          // Return job info to user
          res.status(200).json({
            id: newJob.id,
            site: req.body.site,
            status: 'pending'
          });
        });
      } catch (err) {
        logger.error(err);
      }
    }
  } else{
    res.status(500).json({ error: 'Please include a html site.' });
  }
});

/*
* API Route for getting status/results of a scrapping Job
* Pass a valid job id via JSON in the body.
* EXP:
* {
*   "id": "100" 
* } 
* Returns the status and if job is done results of the job as JSON
* Return EXP:
* {
*   "id": "100",
*   "site": "www.google.com",
*   "status": "Completed",
*   "htmlData": "<site html>"
* }
*/
router.put('/status', async (req, res) => {
  // Verify that req.body.id contains an id
  if (req.body.id !== undefined || req.body.id !== null){ 
    try {
      // Get reults of job from DB
      let results;
      try {
        results = await models.resultModel(req.body.id);
      } catch (err) {
        logger.error(err);
      }
      // If job is completed return job data to user
      if (results.status == 'Complete'){
        // Return results of job to User
        res.status(200).json({
          id: req.body.id,
          site: results.site,
          status: results.status,
          htmlData: results.job_return
        });
      } else {
        // Return job status if not completed.
        res.status(200).json({
          id: req.body.id,
          site: results.site,
          status: results.status
        })
      }
    } catch (err) {
      res.status(500).json({
        id: err,
      });
    }
  }else{
    res.status(500).send({
      error: "Please enter a valid ID in the request body."
    });
  }
})

/**
*  As the jobs appear in the queue process the jobs using the webScraper function.
*  Also sets status of job to In Progress
*/
queue.process('jobs', async (job, done) => {

  let inProgressUpdate = await models.updateStatus(job.id, 'In Progress')
  webScraper(job.id, job.data.site, done);

});

/**
 * On job complete set status to complete and remove job from queue.
 */
queue.on('job complete', async function(id, result){
  let completeUpdate = await models.updateStatus(id, 'Complete');
  kue.Job.get(id, (err, job) =>{
    if (err) { logger.error(err); return };
    job.remove((err) =>{
      if (err) { logger.error(err) };
      logger.info('removed completed job #%d', job.id);
    });
  });
});



// Start Express on port 4000
router.listen(4000);

logger.info(`App started on port ${4000}`);