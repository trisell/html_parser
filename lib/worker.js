const http = require('http');
const https = require('https');

const Models = require('../models/models');

const models = new Models();

/**
 * Function used to get website HTML data and insert it into the db.
 * @param {*} id - Takes ID of Job 
 * @param {*} url - Takes Site URL for processing
 * @param {*} done - Done is called when process is completed to signal queue of job completion.
 */

function getWebsite(id, url, done ){
  // RegEx test for http
  const httpRegex = new RegExp('^http?://');
  
  // Test if url has http or https
  if (httpRegex.test(url)){

    // Get http site
    http.get(url, async res => {

      let body= '';
      
      res.on("data", data => {
        // Concatinate html data streams into one body variable
        body += data.toString();
      });
  
      res.on('end', async () => {
        // On end of data stream insert data into db and notify queue of completion.
        let test = await models.insertResults(id, body);
        done();
      }) 
    });
  
  }else{
    // Get https site
    https.get(url, res => {

      let body = '';
      
      res.on("data", data => {
        //concatinate html data streams into one body variable
        body += data.toString();
      });
  
      res.on('end', async () => {
        // On end of data stream insert data into db and notify queue of completion.
        let test = await models.insertResults(id, body);
        done();
      }) 
    });
  
  }
};

module.exports = getWebsite;


