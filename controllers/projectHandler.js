const mongo = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectID;

const CONNECTION_STRING = process.env.DATABASE; //MongoClient.connect(CONNECTION_STRING, function(err, db) {});
const requiredFields = [
  'issue_title',
  'issue_text',
  'created_by'
]

const allFields = [
  'issue_title',
  'issue_text',
  'created_by',
  'assigned_to',
  'status_text'
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
    db = conn.collection('issues')
    console.log(`Connected to db ${db} at ${CONNECTION_STRING}`)
  }
})

// Create project
exports.projectCreate = (req, res) => {
  let project = req.body
  var missingFields = requiredFields.filter(field => !project.hasOwnProperty(field))
  console.log(`Missing fields are: ${missingFields}`)
  if (missingFields.length > 0) {
    res.status(500).send(`Missing fields: ${missingFields}`)
  } else {
    console.log(`Project contains: `, project)
    db.insertOne(
      {
        issue_title: req.body.issue_title,
        issue_text: req.body.issue_text,
        created_by: req.body.created_by,
        created_on: new Date(),
        assigned_to: req.body.assigned_to,
        open: req.body.open,
        status_text: req.body.status_text
      },
      (err, doc) => {
        if (err) {
          console.error(err)
          res.status(501).send(err)
        }
        else {
          console.log(`Project record has been created:`, doc.ops[0])
          res.json(doc.ops[0])
        }
      })
  }

}

// Update project
exports.projectUpdate = (req, res) => {
  let project = req.body
  let id = new ObjectId(req.body._id) 
  delete project._id
  let newvalues = { $set: project }
  console.log('ID is: ', id)
  console.log(`Project data is: `, project)
  console.log(`New values are: `, newvalues)
  if (Object.keys(project).length <= 0) {
    res.status(500)
    res.send(`no updated field sent`)
  } else {
    console.log(`It's a GO sending data your way...`)
    db.findOne({ '_id': id }, (err, issue) => {
      if (err) {
        console.log(`Something's not right....`)
        console.error(err)
      }
      else if (issue === null) {
        res.status(500).send('No project on file')
      }
      else {
        console.log('Record avaiable: ', issue)
        db.updateOne({ '_id': id }, newvalues, (err, results) => {
          if (err) {
            console.error(err)
            res.status(501).send(`could not update ${id}`)
          }
          else {
            console.log(`successfully updated `, results.result)
            res.send('successfully updated')
          }

        })
      }
    })
    // res.json(project)
  }
  
}

// Display project
exports.projectDisplay = (req, res) => {
  console.log(`Incoming request options: `, req.query)
  let { query } = req
  // db.find(query).toArray((err, result) => {
  //   if (err) {
  //     console.error(err)
  //     res.status(500).res.send('no record available')
  //   } else {
  //     console.log(`Sending results: `, result)
  //     res.status(200).res.send(result)
  //   }
  // })
  res.json('Display project')
}

// Delete project
exports.projectDelete = (req, res) => {
  // db.remove()
  res.json('Delete project')
}



