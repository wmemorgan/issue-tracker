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

let db

mongo.connect(CONNECTION_STRING, async (err, conn) => {
  if (err) throw err
  else { 
    db = await conn.collection('issues')
  }
})

// Create project
exports.projectCreate = (req, res) => {
  let project = req.body
  var missingFields = requiredFields.filter(field => !project.hasOwnProperty(field))
  if (missingFields.length > 0) {
    res.status(400).send(`Missing fields: ${missingFields}`)
  } else {
    db.insertOne(
      {
        issue_title: req.body.issue_title,
        issue_text: req.body.issue_text,
        created_by: req.body.created_by,
        created_on: new Date(),
        updated_on: null,
        assigned_to: req.body.assigned_to,
        open: true,
        status_text: req.body.status_text
      },
      (err, doc) => {
        if (err) {
          console.error(err)
          res.status(500).send(err)
        }
        else {
          res.json(doc.ops[0])
        }
      })
  }

}

// Update project
exports.projectUpdate = (req, res) => {
  //UTILITY PROGRAM: to clean up database
  // db.remove()
  let body = Object.keys(req.body).length > 0 ? req.body : {}

  //Convert "true/false" string to boolean type
  if (body.open == "true" || body.open == "false") {
    body.open = (body.open == "true")
  }

  let project = {}
  Object.keys(body).forEach((key) => {
    if (body[key] !== "") {
      project[key] = body[key]
    }
  })

  let id = new ObjectId(body._id) 
  delete project._id
 
  if (Object.keys(project).length <= 0) {
    res.status(400)
    res.send(`no updated field sent`)
  } else {
    db.findOne({ '_id': id }, (err, issue) => {
      if (err) {
        console.error(err)
        res.status(400).send(`Something's not right....`)
      }
      else if (issue === null) {
        res.send('No project on file')
      }
      else {
        project.updated_on = new Date()
        let newvalues = { $set: project }
        db.updateOne({ '_id': id }, newvalues, (err, results) => {
          if (err) {
            console.error(err)
            res.status(501).send(`could not update ${id}`)
          }
          else {
            res.send('successfully updated')
          }

        })
      }
    })
  }
  
}

// Display project
exports.projectDisplay = (req, res) => {
  let { query } = req

  //Convert "true/false" string to boolean type
  if (query.open == "true" || query.open == "false") {
    query.open = (query.open == "true")
  }
  db.find(query).toArray((err, result) => {
    if (err) {
      console.error(err)
      res.status(500).res.send('no record available')
    } else {
      res.send(result)
    }
  })
}

// Delete project
exports.projectDelete = (req, res) => {
  //UTILITY PROGRAM: to clean up database
  // db.remove()
  if(!req.query._id) {
    res.status(400).send('_id error')
  } else {
    let id = new ObjectId(req.query._id)
    db.findOne({ '_id': id }, (err, issue) => {
      if (err) {
        console.error(err)
        res.status(400).send(`Something's not right....`)
      }
      else if (issue === null) {
        res.status(400).send('No project on file')
      } else {
        db.deleteOne({_id: id}, (err, doc) => {
          if (err) {
            console.error(err)
            res.send(`could not delete ${id}`)
          }
          else {
            console.log(`deleted ${id}`)
            res.send(`deleted ${id}`)
          }
        })
      }
    })
  }
}



