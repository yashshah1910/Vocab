const express = require("express");
const recordRoutes = express.Router();
// Connect to the database
const dbo = require("../db/conn");
const ObjectId = require("mongodb").ObjectId;

// To get a list of all the records.
recordRoutes.route("/record").get(function (req, res) {
  let db_connect = dbo.getDb("employees");
  db_connect
    .collection("records")
    .find({})
    .toArray(function (err, result) {
      if (err) throw err;
      res.json(result);
    });
});

// To create a new record.
recordRoutes.route("/record/add").post(function (req, response) {
  let db_connect = dbo.getDb();
  //  console.log(req.body);
  let myobj = {
    name: req.body.results[0].id, // Storing new word as name
    data: req.body, // And API data as data
  };
  //  console.log(req.body.results[0].id);
  db_connect.collection("records").insertOne(myobj, function (err, res) {
    if (err) throw err;
    response.json(res);
  });
});

module.exports = recordRoutes;
