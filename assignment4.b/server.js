/*********************************************************************************
* WEB322 – Assignment 04
* I declare that this assignment is my own work in accordance with Seneca Academic Policy. No part
* of this assignment has been copied manually or electronically from any other source
* (including 3rd party web sites) or distributed to other students.
*
* Name: Mohammad Sharafifar        Student ID: 143473171       Date: 01-July-2019
*
* Online (Heroku) Link: 
*
********************************************************************************/ 

var HTTP_PORT = process.env.PORT || 8080;
var express = require("express");
var app = express();
var data_service = require("./data-service.js")
var path = require("path");
const exphbs = require("express-handlebars");
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

  app.engine(".hbs", exphbs({ extname: ".hbs", 
    defaultLayout: "main",
    helpers: {
        navLink: function(url, options){
            return '<li' +
            ((url == app.locals.activeRoute) ? ' class="active" ' : '') +
            '><a href="' + url + '">' + options.fn(this) + '</a></li>'; 
        },

        equal: function (lvalue, rvalue, options) {
            if (arguments.length < 3)
                throw new Error("Handlebars Helper equal needs 2 parameters");
                if (lvalue != rvalue) {
                    return options.inverse(this);
                } else {
                    return options.fn(this);
                }
            }

    }
    }));



  app.set("view engine", ".hbs");

  app.use(function(req,res,next){
    let route = req.baseUrl + req.path;
    app.locals.activeRoute = (route == "/") ? "/" : route.replace(/\/$/, "");
    next();
   });

//---------------------------------------------------------------------
//     Setup routes 
//---------------------------------------------------------------------
app.get("/", (req,res) => {
//    res.sendFile(path.join(__dirname,"/views/home.html"));
    res.render("home");
});

app.get("/home", (req,res) => {
//    res.sendFile(path.join(__dirname,"/views/home.html"));
    res.render("home");
});

app.get("/about", (req,res) => {
//    res.sendFile(path.join(__dirname,"/views/about.html"));
    res.render("about");
});

app.get("/employees", function (req, res) {
    if (req.query.status) {
        data_service.getEmployeesByStatus(req.query.status)
            .then((data) => {
//                res.json(data)
                res.render("employees",{employees: data})
            })
            .catch((msgerr) => {
//                res.json(msgerr)
                res.render({message: "no results"});

            })
    } else 
        if (req.query.department) {
            data_service.getEmployeesByDepartment(req.query.department)
                .then((data) => {
//                    res.json(data)
                    res.render("employees",{employees: data})
                })
                .catch((msgerr) => {
//                    res.json(msgerr)
                    res.render({message: "no results"});

                })
            } else
            if (req.query.manager) {
                data_service.getEmployeesByManager(req.query.manager)
                    .then((data) => {
//                        res.json(data);
                        res.render("employees",{employees: data})
                    })
                    .catch((msgerr) => {
//                        res.json(msgerr);
                        res.render({message: "no results"});

                    })
                } else {
                data_service.getAllEmployees()
                    .then((data) => {
//                        res.json(data);
                        res.render("employees",{employees: data})
                    })
                    .catch((msgerr) => {
//                        res.json(msgerr);
                        res.render({message: "no results"});

                    })
                }
        })

app.get("/employee/:num", function (req, res) {
    data_service.getEmployeesByNum(req.params.num)
        .then((data) => {
            res.render("employee", { employee: data });
//            res.json(data);
        })
        .catch((msgerr) => {
//            res.json(msgerr);
            res.render("employee", {message: "no results"});
        })
});  
/*
app.get("/managers", function (req, res) {
    data_service.getManagers()
        .then((data) => {
            res.json(data);
        })
        .catch((msgerr) => {
            res.json(msgerr);
        })
});
*/
app.get("/departments", function (req, res) {
    data_service.getDepartments()
        .then((data) => {
//            res.json(data);
            res.render("departments", {departments: data})
        })

        .catch(() => {
            res.render("departments", {
                message: "no results"
            })
        })
//        .catch((msgerr) => {
//            res.json(msgerr);
//        })
});

app.get("/employees/add", (req,res) => {
//    res.sendFile(path.join(__dirname,"/views/addEmployee.html"));
    res.render("addEmployee");
});

app.get("/images/add", (req,res) => {
//    res.sendFile(path.join(__dirname,"/views/addImage.html"));
    res.render("addImage");
});

app.post("/images/add", upload.single("imageFile"), (req,res) => {
    res.redirect("/images");
});

app.get("/images", (req,res) => {
    var uploadPath = path.join(__dirname, "./public/images/uploaded");
    fs.readdir(uploadPath, function(err, data) {
 //       res.send({images:data});

        res.render("images",{images:data}); //res.render("images",{images:data});
    });
});


app.post("/employees/add", (req, res, Employees) => {
    data_service.addEmployee(req.body)
    .then((Employees) => {
        res.redirect("/employees");
    })
    .catch(() => {
        console.log("Add employee NOT successful");
    });
});

app.post("/employee/update", (req, res) => {
    data_service.updateEmployee(req.body)
    .then(() => {
        res.redirect("/employees")
    })
    .catch(() => {
        message: "Error on updating Employee"
        res.render("/employees")
    })
   });


//               Status 404 - Page not Found
app.use(function (req, res) {
    res.status(404).sendFile(path.join(__dirname,"/views/er404.html"));
  })

//---------------------------------------------------------------------
//     Log msg - HTTP IS LISTENING
//---------------------------------------------------------------------
  function onHttpStart() {
    console.log("Express http server listening on " + HTTP_PORT);
    }

//---------------------------------------------------------------------
// setup http server to listen on HTTP_PORT
//---------------------------------------------------------------------

data_service.initialize()
    .then(() => {
        app.listen(HTTP_PORT,onHttpStart);
//        app.use(express.static('public'));
    })

    .catch(msgerr => { 
        console.log(msgerr);
    })