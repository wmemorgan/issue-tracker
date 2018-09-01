/*
*
*
*       Complete the API routing below
*
*
*/

'use strict';

var expect = require('chai').expect;
var MongoClient = require('mongodb');
var ObjectId = require('mongodb').ObjectID;
const projectHandler = require('../controllers/projectHandler')

module.exports = function (app) {

  app.route('/api/issues/:project')
    .get(projectHandler.projectDisplay)

    .post(projectHandler.projectCreate)
    
    .put(projectHandler.projectUpdate)
    
    .delete(projectHandler.projectDelete);
};
