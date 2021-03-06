/*
*
*
*       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
*       -----[Keep the tests in the same order!]-----
*       (if additional are added, keep them at the very end!)
*/

var chaiHttp = require('chai-http');
var chai = require('chai');
var assert = chai.assert;
var server = require('../server');

const PROJECT_ID = '5b8d680cc563b78f0e715559'

chai.use(chaiHttp);

suite('Functional Tests', function() {
  
    suite('POST /api/issues/{project} => object with issue data', function() {
      test('Every field filled in', function(done) {
       chai.request(server)
        .post('/api/issues/test')
        .send({
          issue_title: 'Title',
          issue_text: 'text',
          created_by: 'Functional Test - Every field filled in',
          assigned_to: 'Chai and Mocha',
          status_text: 'In QA'
        })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.equal(res.body.issue_title, 'Title')
          assert.equal(res.body.issue_text, 'text')
          assert.equal(res.body.created_by, 'Functional Test - Every field filled in')
          assert.equal(res.body.assigned_to, 'Chai and Mocha')
          assert.equal(res.body.open, true),
          assert.equal(res.body.status_text, 'In QA')
          done();
        });
      });
      
      test('Required fields filled in', function(done) {
        chai.request(server)
          .post('/api/issues/test')
          .send({
            issue_title: 'Title',
            issue_text: 'text',
            created_by: 'Functional Test - Every field filled in'
          })
          .end((err, res) => {
            assert.equal(res.status, 200);
            assert.equal(res.body.issue_title, 'Title')
            assert.equal(res.body.issue_text, 'text')
            assert.equal(res.body.created_by, 'Functional Test - Every field filled in')
            done()
          })
      });
      
      test('Missing required fields', function(done) {
        chai.request(server)
          .post('/api/issues/test')
          .send({
            assigned_to: 'Chai and Mocha',
            status_text: 'In QA'
          })
          .end((err, res) => {
            console.log(`res.text`, res.text)
            assert.equal(res.status, 400)
            assert.equal(res.text, 'Missing fields: issue_title,issue_text,created_by')
            done()
          })
      });
      
    });
    
    suite('PUT /api/issues/{project} => text', function() {
      test('No body', function(done) {
        chai.request(server)
          .put('/api/issues/test')
          .send({})
          .end((err, res) => {
            console.log(`res.text: `, res.text)
            assert.equal(res.status, 400)
            assert.equal(res.text, 'no updated field sent')
            done()
          })
      });
      
      test('One field to update', function(done) {
        chai.request(server)
          .put('/api/issues/test')
          .send({
            _id: PROJECT_ID,
            assigned_to: 'R2D2'
          })
          .end((err, res) => {
            assert.equal(res.status, 200)
            assert.equal(res.text, 'successfully updated')
            done()
          })
      });
      
      test('Multiple fields to update', function(done) {
        chai.request(server)
          .put('/api/issues/test')
          .send({
            _id: PROJECT_ID,
            issue_title: 'Internet down', 
            status_text: `Fixed the problem. Outage caused by telco`,
            open: false
          })
          .end((err, res) => {
            assert.equal(res.status, 200)
            assert.equal(res.text, 'successfully updated')
            done()
          })  
      });
      
    });
    
    suite('GET /api/issues/{project} => Array of objects with issue data', function() {
      test('No filter', function(done) {
        chai.request(server)
        .get('/api/issues/test')
        .query({})
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.isArray(res.body);
          assert.property(res.body[0], 'issue_title');
          assert.property(res.body[0], 'issue_text');
          assert.property(res.body[0], 'created_on');
          assert.property(res.body[0], 'updated_on');
          assert.property(res.body[0], 'created_by');
          assert.property(res.body[0], 'assigned_to');
          assert.property(res.body[0], 'open');
          assert.property(res.body[0], 'status_text');
          assert.property(res.body[0], '_id');
          done();
        });
      });
      
      test('One filter', function(done) {
        chai.request(server)
        .get('/api/issues/test')
        .query({ issue_title: 'Title' })
        .end((er, res) => {
          assert.equal(res.status, 200)
          assert.equal(res.body[0].issue_title, 'Title')
          done()
        })
      });
      
      test('Multiple filters (test for multiple fields you know will be in the db for a return)', function(done) {
        chai.request(server)
        .get('/api/issues/test')
        .query({ 
          assigned_to: 'R2D2',
          issue_title: 'Internet down'
        })
        .end((err, res) => {
          assert.equal(res.status, 200)
          assert.equal(res.body[0].assigned_to, 'R2D2')
          assert.equal(res.body[0].issue_title, 'Internet down')
          done()
        })
        
      });
      
    });
    
    suite('DELETE /api/issues/{project} => text', function() {
      test('No _id', function(done) {
        chai.request(server)
        .delete('/api/issues/test')
        .end((err, res) => {
          assert.equal(res.status, 400)
          done()
        })
      })
      
      // test('Valid _id', function(done) {
      //   chai.request(server)
      //   .delete('/api/issues/test')
      //   .query({_id: PROJECT_ID})
      //   .end((err, res) => {
      //     console.log(res.body)
      //     assert.equal(res.status, 200)
      //     assert.equal(res.text, `deleted ${PROJECT_ID}`)
      //     done()
      //   })
      // })
    });

});
