const mongo = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectID;

const CONNECTION_STRING = process.env.DATABASE; //MongoClient.connect(CONNECTION_STRING, function(err, db) {});
let db

mongo.connect(CONNECTION_STRING, function (err, conn) {
  if (err) throw err
  else { 
    db = conn
    console.log(`Connected to db ${db} at ${CONNECTION_STRING}`)
  }
})

// Create project
exports.projectCreate = (req, res) => {
  res.json('Create project')
}

// Update project
exports.projectUpdate = (req, res) => {
  res.json('Update project')
}

// Display project
exports.projectDisplay = (req, res) => {
  res.json('Display project')
}

// Delete project
exports.projectDelete = (req, res) => {
  res.json('Delete project')
}



