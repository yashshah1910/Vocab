const express = require("express");
const recordRoutes = express.Router();
// Connect to the database
const dbo = require("../db/conn");

const ObjectId = require("mongodb").ObjectId;
const fetch = require("node-fetch");

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
  // API call to oxford API
  const url = `https://od-api.oxforddictionaries.com/api/v2/words/en-gb?q=${req.body.name}`;
  const headers = {
    Accept: "application/json",
    "Content-Type": "application/json",
    app_id: "61860c4f",
    app_key: "aaa7a11304d5a4df9054bf686601d2b6",
    "Access-Control-Allow-Origin": "*",
  };
  fetch(url, { method: "GET", headers: headers })
    .then((res) => {
      return res.json();
    })
    .then((json) => {
      // returned data.
      const data = json;
      // console.log(data);
      let myobj = {
        name: data.results[0].id, // Storing new word as name
        data: data, // And API data as data
      };
      // console.log(myobj);
      // storing in MongoDb
      db_connect.collection("records").insertOne(myobj, function (err, res) {
        if (err) throw err;
        response.json(res);
      });
    });
});

module.exports = recordRoutes;
