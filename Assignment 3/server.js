/*********************************************************************************
* WEB322 – Assignment 03
* I declare that this assignment is my own work in accordance with Seneca Academic Policy. No part
* of this assignment has been copied manually or electronically from any other source
* (including 3rd party web sites) or distributed to other students.
*
* Name: Mohammad Sharafifar       Student ID: 143473171       Date: 14-june-2019
*
* Online Link:  https://rocky-hamlet-29058.herokuapp.com/ deployed to Heroku
*
********************************************************************************/ 

var HTTP_PORT = process.env.PORT || 8080;
var express = require("express");
var app = express();
var data_service = require("./data-service.js")
var path = require("path");
var multer = require("multer");
var fs = require("fs");
var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended:true }));
app.use(express.static('public'));

const storage = multer.diskStorage({
    destination: "./public/images/uploaded",
    filename: function (req, file, cb) {
      cb(null, Date.now() + path.extname(file.originalname));
    }
  });
  const upload = multer({ storage: storage });

 
//     Setup routes 
 
app.get("/", (req,res) => {
    res.sendFile(path.join(__dirname,"/views/home.html"));
});

app.get("/home", (req,res) => {
    res.sendFile(path.join(__dirname,"/views/home.html"));
});

app.get("/about", (req,res) => {
    res.sendFile(path.join(__dirname,"/views/about.html"));
});
  
app.get("/employees", function (req, res) {
  if (req.query.status) {
      data_service.getEmployeesByStatus(req.query.status)
          .then((data) => {
              res.json(data)
          })
          .catch((msgerr) => {
              res.json(msgerr)
          })
  } else 
      if (req.query.department) {
          data_service.getEmployeesByDepartment(req.query.department)
              .then((data) => {
                  res.json(data)
              })
              .catch((msgerr) => {
                  res.json(msgerr)
              })
          } else
          if (req.query.manager) {
              data_service.getEmployeesByManager(req.query.manager)
                  .then((data) => {
                      res.json(data);
                  })
                  .catch((msgerr) => {
                      res.json(msgerr);
                  })
              } else {
              data_service.getAllEmployees()
                  .then((data) => {
                      res.json(data);
                  })
                  .catch((msgerr) => {
                      res.json(msgerr);
                  })
              }
      })

app.get("/employee/:num", function (req, res) {
  data_service.getEmployeesByNum(req.params.num)
      .then((data) => {
          res.json(data);
      })
      .catch((msgerr) => {
          res.json(msgerr);
      })
});  

app.get("/managers", function (req, res) {
  data_service.getManagers()
      .then((data) => {
          res.json(data);
      })
      .catch((msgerr) => {
          res.json(msgerr);
      })
});

app.get("/departments", function (req, res) {
  data_service.getDepartments()
      .then((data) => {
          res.json(data);
      })

      .catch((msgerr) => {
          res.json(msgerr);
      })
});

app.get("/employees/add", (req,res) => {
  res.sendFile(path.join(__dirname,"/views/addEmployee.html"));
});

app.get("/images/add", (req,res) => {
  res.sendFile(path.join(__dirname,"/views/addImage.html"));
});

app.post("/images/add", upload.single("imageFile"), (req,res) => {
  res.redirect("/images");
});

app.get("/images", (req,res) => {
  var uploadPath = path.join(__dirname, "./public/images/uploaded");
  fs.readdir(uploadPath, function(err, data) {
      res.send({images:data});

      
  });
});


app.post("/employees/add", (req, res, Employees) => {
  data_service.addEmployee(req.body)
  .then((Employees) => {
      res.redirect("/employees");
  })
  .catch(() => {
      console.log("NOT successful");
  });
});


//err 404
app.use(function (req, res) {
  res.status(404).sendFile(path.join(__dirname,"/views/er404.html"));
})

 
//     Log msg - HTTP IS LISTENING
 
function onHttpStart() {
  console.log("Express http server listening on " + HTTP_PORT);
  }

 
// setup http server to listen on HTTP_PORT
 

data_service.initialize()
  .then(() => {
      app.listen(HTTP_PORT,onHttpStart);
  })

  .catch(msgerr => { 
      console.log(msgerr);
  })