/********************************************************************************* *
 WEB322 – Assignment 02 * I declare that this assignment is my own work in accordance with Seneca
 Academic Policy. No part * of this assignment has been copied manually or electronically from any
 other source * (including 3rd party web sites) or distributed to other students. *
 * Name: Mohammad Sharafifar Student ID: 134473171 Date: 22 may 2019 * 
 * Online (Heroku) Link: https://sheltered-basin-57335.herokuapp.com  *
 ********************************************************************************/ 


var express = require("express");
var app = express();
var data_server = require("./data/data-service.js")
var path = require("path")
var HTTP_PORT = process.env.PORT || 8080;
////

app.use(express.static('public'));

// call this function after the http server starts listening for requests
function onHttpStart() {
    console.log("Express http server listening on: " + HTTP_PORT);
  }

  // setup a 'route' to listen on the default url path (http://localhost)
app.get("/", function(req,res){
   // res.send("Hello World<br /><a href='/about'>Go to the about page</a>");

   res.sendFile(path.join(__dirname, "views/home.html"))
 });

 app.get("/about", function(req,res){
    // res.send("Hello World<br /><a href='/about'>Go to the about page</a>");
 
    res.sendFile(path.join(__dirname, "/views/about.html"))
  });

  app.get("/departments", function (req, res) {
    data_server.getDepartments()
        .then((data) => { res.json(data); })

        .catch((err) => { res.json(err); })
});

app.get("/employees", function (req, res) {
    data_server.getAllEmployees()
        .then((data) => { res.json(data) })
        .catch((err) => { res.json(err) })
});

app.get("/managers", function (req, res) {
    data_server.getManagers()
        .then((data) => { res.json(data); })
        .catch((err) => { res.json(err); })
});
app.use(function (req, res) {
    res.status(404).sendFile(path.join(__dirname,"views/error.html"));
  })

data_server.initialize()
    .then(() => { app.listen(HTTP_PORT,onHttpStart); })
    .catch(err => { console.log(err); })
app.use(express.static('public'));