const mongo = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectID;

const CONNECTION_STRING = process.env.DATABASE; //MongoClient.connect(CONNECTION_STRING, function(err, db) {});
const requiredFields = [
  'issue_title',
  'issue_text',
  'created_by'
]

const verifyProjectData = (data) => {
  if (Object.keys(project).length < 1) {
    console.log('No data')
    return false
  } else { 
    return data
  }
}

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
  let project = req.body
  var missingFields = requiredFields.filter(field => !project.hasOwnProperty(field))
  console.log(`Missing fields are: ${missingFields}`)
  if (missingFields.length > 0) {
    res.status(500)
    res.send(`Missing fields: ${missingFields}`)
  } else {
    console.log(`Project contains: `, project)
    res.json(project)
  }

}

// Update project
exports.projectUpdate = (req, res) => {
  let project = req.body
  console.log(`Object is: `, project)
  if (Object.keys(project).length < 1) {
    res.status(500)
    res.send(`No body`)
  } else {
    console.log(`It's a GO sending data your way...`)
    res.json(project)
  }
  
}

// Display project
exports.projectDisplay = (req, res) => {
  res.json('Display project')
}

// Delete project
exports.projectDelete = (req, res) => {
  res.json('Delete project')
}



