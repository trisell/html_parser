const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../main');
const postgres = new(require('../lib/postgres'));
const config = require('../config');

let expect = chai.expect;

chai.use(chaiHttp);

const newJobRequest = {
  site: 'http://www.google.com'
}

let testId;

describe('/Post to /new to add a new job', () => {
  it('Should add a new job', (done) => {
    chai.request(server)
      .post('/new')
      .send('content-type', 'application/json')
      .send(newJobRequest)
      .end((err, res) => {
        if (err) { done(err)}
        testId = res.body.id;
        expect(res.status).to.equal(200);
        expect(res.body)
          .to.have.property('id');
        expect(res.body)
          .to.have.property('site')
          .and.to.equal(newJobRequest.site);
        expect(res.body)
          .to.have.property('status')
          .and.to.equal('pending');
          done()
      })
  });

  it('Should create a job in the db', async () => {
    const sql = `
      SELECT * from html.jobs
      WHERE id = ${testId};
    `
    let testQuery = await postgres.query(sql);

    expect(testQuery.rows[0])
      .to.have.property('id')
      .and.to.equal(testId.toString());
    
    expect(testQuery.rows[0])
      .to.have.property('site')
      .and.to.equal(newJobRequest.site);

    expect(testQuery.rows[0])
      .to.have.property('status')
      .and.to.equal("pending");

  });

  it('should fail if no id is provided', (done) => {
    chai.request(server)
    .post('/new')
    .send('content-type', 'application/json')
    .send()
    .end((err, res) => {
      if (err) { done(err)}
      expect(res.status).to.equal(500);
      expect(res.body)
        .to.have.property('error')
        .and.to.equal("Please include either http:// or https:// in your site request.");
      done()
    })
  });
});

describe('Test /results end point', () => {
  // Hold test for a second to allow job to progress through system.
  before((done) => {
    setTimeout(() =>{
      done();
    }, 1000);
  });
  it('Should get a result', (done) => {
    chai.request(server)
      .put('/status')
      .send('content-type', 'application/json')
      .send({
        id: testId
      })
      .end(async (err, res) => {
        if (err) { done(err)}
        expect(res.status).to.equal(200);

        expect(res.body)
        .to.have.property('id')
        .and.to.equal(testId.toString());

        expect(res.body)
          .to.have.property('site')
          .and.to.equal(newJobRequest.site);
        
        expect(res.body)
          .to.have.property('status')
          .and.to.equal('Complete');
          
        expect(res.body)
          .to.have.property('htmlData');
      });
      done();
    });

});