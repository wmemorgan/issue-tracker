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

const PROJECT_ID = '5b8cc4217d3aa916cd2d7edd'

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
          open: true,
          status_text: 'In QA'
        })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.equal(res.body.issue_title, 'Title')
          assert.equal(res.body.issue_text, 'text')
          assert.equal(res.body.created_by, 'Functional Test - Every field filled in')
          assert.equal(res.body.assigned_to, 'Chai and Mocha')
          assert.equal(res.body.open, true)
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
            assert.equal(res.status, 500)
            done()
          })
      });
      
    });
    
    suite('PUT /api/issues/{project} => text', function() {

      // test('PUT: Update project msg', (done) => {
      //   chai.request(server)
      //     .put('/api/issues/test')
      //     .end((err, res) => {
      //       assert.equal(res.status, 200)
      //       assert.equal(res.body, 'Update project')
      //       done()
      //     })
      // })

      test('No body', function(done) {
        chai.request(server)
          .put('/api/issues/test')
          .send({})
          .end((err, res) => {
            assert.equal(res.status, 500)
            done()
          })
      });
      
      test('One field to update', function(done) {
        chai.request(server)
          .put('/api/issues/test')
          .send({
            _id: PROJECT_ID,
            assigned_to: 'R2D2',
            updated_on: new Date() 
          })
          .end((err, res) => {
            assert.equal(res.status, 200)
            // assert.isAtLeast(Object.keys(res.body).length, 1)
            done()
          })
      });
      
      test('Multiple fields to update', function(done) {
        chai.request(server)
          .put('/api/issues/test')
          .send({
            _id: PROJECT_ID, 
            status_text: `Fixed the problem. Outage caused by telco`,
            open: false,
            updated_on: new Date() 
          })
          .end((err, res) => {
            assert.equal(res.status, 200)
            // assert.isAbove(Object.keys(res.body).length, 1)
            done()
          })  
      });
      
    });
    
    suite('GET /api/issues/{project} => Array of objects with issue data', function() {

      // test('GET: Display project msg', (done) => {
      //   chai.request(server)
      //     .get('/api/issues/test')
      //     .end((err, res) => {
      //       assert.equal(res.status, 200)
      //       assert.equal(res.body, 'Display project')
      //       done()
      //     })
      // }) 

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
        
      });
      
      test('Multiple filters (test for multiple fields you know will be in the db for a return)', function(done) {
        
      });
      
    });
    
    suite('DELETE /api/issues/{project} => text', function() {
      test('DELETE: Delete project msg', (done) => {
        chai.request(server)
          .delete('/api/issues/test')
          .end((err, res) => {
            assert.equal(res.status, 200)
            assert.equal(res.body, 'Delete project')
            done()
          })
      })

      test('No _id', function(done) {
        
      });
      
      test('Valid _id', function(done) {
        
      });
      
    });

});
