/*********************************************************************************
* WEB322 – Assignment 03
* I declare that this assignment is my own work in accordance with Seneca Academic Policy. No part
* of this assignment has been copied manually or electronically from any other source
* (including 3rd party web sites) or distributed to other students.
*
* Name: Mohammad Sharafifar       Student ID: 143473171       Date: 14-june-2019
*
* Online Link:   https://mysterious-brushlands-49855.herokuapp.com  deployed to Heroku
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
var dataServiceAuth = require('./data-service-auth.js');
var clientSessions = require("client-sessions");


const storage = multer.diskStorage({
    destination: "./public/images/uploaded",
    filename: function (req, file, cb) {
      cb(null, Date.now() + path.extname(file.originalname));
    }
  });
  const upload = multer({ storage: storage });

  app.use(clientSessions({
    cookieName: "session", 
    secret: "assignment6",
    duration: 2 * 60 * 1000,            // 2 minutes
    activeDuration: 1000 * 60 
}));

app.use(function(req, res, next) {
    res.locals.session = req.session;
    next();
});

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
    //*    console.log("/employees");
        if (req.query.status) {
            data_service.getEmployeesByStatus(req.query.status)
                .then((data) => {
    //                res.json(data)
    //                res.render("employees",{employees: data})
                    res.render("employeeList", {data: data, title: "Employees"})
                })
                .catch((msgerr) => {
    //                res.json(msgerr)
    //                res.render({message: "no results"});
                    res.render("employeeList", {data: {}, title: "Employees"})
                })
        } else {
    //*    console.log("/employees else 1");
            if (req.query.department) {
                data_service.getEmployeesByDepartment(req.query.department)
                    .then((data) => {
    //                    res.json(data)
    //                    res.render("employees",{employees: data})
                        res.render("employeeList", {data: data, title: "Employees"})
                    })
                    .catch((msgerr) => {
    //                    res.json(msgerr)
    //                    res.render({message: "no results"});
                        res.render("employeeList", {data: {}, title: "Employees"})
    
                    })
                } else {
    //*            console.log("/employees else 2");
                if (req.query.manager) {
                    data_service.getEmployeesByManager(req.query.manager)
                        .then((data) => {
    //                        res.json(data);
    //                        res.render("employees",{employees: data})
                            res.render("employeeList", {data: data, title: "Employees"})
                        })
                        .catch((msgerr) => {
    //                        res.json(msgerr);
    //                        res.render({message: "no results"});
                            res.render("employeeList", {data: {}, title: "Employees"})
                        })
                    } else {
    //*                    console.log("/employees else 3");
                    data_service.getAllEmployees()
                        .then((data) => {
                            console.log("/employees else 3 - then");
    //                        res.json(data);
    //                        res.render("employees",{employees: data})
                            res.render("employeeList", {data: data, title: "Employees"}
                        )})
                        .catch((msgerr) => {
    //*                        console.log("/employees else 3 - catch");
    //                        res.json(msgerr);
    //                        res.render({message: "no results"});
                            res.render("employeeList", {data: {}, title: "Employees"})
                        })
                    }}}
            })
    /*
    app.get("/employee/:num", function (req, res) {
        console.log("employee num    fffffffffffffffffffffffffffffffffffffffffffffffff")
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
    */
    
    
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
    //            res.render("departments", {departments: data});
                res.render("departmentList", { data: data, title: "Departments" });
            })
    
            .catch((err) => {
    //            res.render("departments", {  
                res.render("departmentList", { data: {}, title: "Departments" });
                    message: "no results"
            })
    //        })
    //        .catch((msgerr) => {
    //            res.json(msgerr);
    //        })
    });
    
    //app.get("/employees/add", (req,res) => {
    //    res.render("addEmployee");
    //});
    
    app.get("/employees/add", (req, res) => {
        data_service.getDepartments()
        .then((data) => {
            res.render("addEmployee",{departments: data});
        })
        .catch((err) => {
            res.render("addEmployee", {departments: []});
        });
    });
    
    app.get("/images/add", (req,res) => {
    //    res.sendFile(path.join(__dirname,"/views/addImage.html"));
        res.render("addImage", { title: "Images" });
    });
    
    app.post("/images/add", upload.single("imageFile"), (req,res) => {
        res.redirect("/images");
    });
    
    app.get("/images", (req,res) => {
        var uploadPath = path.join(__dirname, "./public/images/uploaded");
        fs.readdir(uploadPath, function(err, data) {
     //       res.send({images:data});
    
            res.render("images",{images:data, title: "Images"}); //res.render("images",{images:data});
        });
    });
    
    
    //app.post("/employees/add", (req, res, Employees) => {
    app.post("/employees/add", (req, res) => {
        data_service.addEmployee(req.body)
        .then((Employees) => {
            res.redirect("/employees");
        })
        .catch((err) => {
            console.log("Add employee NOT successful");
        });
    });
    
    app.post("/employee/update", (req, res) => {
    //*    console.log("employee update entreiiiiiiiiiiiiiiiiiii")
        data_service.updateEmployee(req.body)
        .then((data) => {
            res.redirect("/employees")
        })
        .catch((err) => {
            message: "Error on updating Employee"
            console.log("Error on updating Employee")
            res.render("/employees")
        })
       });
    
    app.get("/departments/add", (req, res) => {
        res.render("addDepartment", {title: "Department"});
    });
    
    app.post("/departments/add", (req, res) => {
        data_service.addDepartment(req.body)
        .then((data) => {
            res.redirect("/departments");
        }).catch(() => {
            console.log(err);
        });
    });
    
    app.post("/department/update", (req,res) => {
        data_service.updateDepartment(req.body)
        .then((data) => {
            res.redirect("/departments");
        });
    });
    
    app.get("/department/:departmentId", (req, res) => {
        data_service.getDepartmentById(req.params.departmentId)
        .then((data) => {
            res.render("department", {
               data: data
            });
        }).catch((err) => {
            res.status(404).send("Department Not Found");
        });
    });
    
    app.get("/employee/:empNum", (req, res) => {
        // initialize an empty object to store the values
        let viewData = {};
        data_service.getEmployeesByNum(req.params.empNum)
        .then((data) => {
            viewData.data = data; //store employee data in the "viewData" object as "data"
        }).catch(()=>{
            viewData.data = null; // set employee to null if there was an error
        }).then(data_service.getDepartments)
        .then((data) => {
            viewData.departments = data; // store department data in the "viewData" object as "departments"
       
        // loop through viewData.departments and once we have found the departmentId that matches
        // the employee's "department" value, add a "selected" property to the matching
        // viewData.departments object
        for (let i = 0; i < viewData.departments.length; i++) {
            if (viewData.departments[i].departmentId == viewData.data.department) {
    //        if (viewData.departments[i].departmentId == viewData.employee.department) {
                viewData.departments[i].selected = true;
            }
        }
        }).catch(()=>{
            viewData.departments=[]; // set departments to empty if there was an error
        }).then(()=>{
            if(viewData.data == null){ // if no employee - return an error
                res.status(404).send("Employee Not Found");
            }else{
                res.render("employee", { viewData: viewData }); // render the "employee" view
            }
        });
    });
    
       app.get("/employee/delete/:empNum", (req, res) => {
            data_service.deleteEmployeeByNum(req.params.empNum)
            .then((data) => {
                res.redirect("/employees");
            }).catch((err) => {
                res.status(500).send("Unable to Remove Employee / Employee not found");
            });
        });
    
        app.get("/department/delete/:deptNum", (req, res) => {
            data_service.deleteDepartmentByNum(req.params.deptNum)
            .then((data) => {
                res.redirect("/departments");
            }).catch((err) => {
                res.status(500).send("Unable to Remove Department / Department not found");
            });
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