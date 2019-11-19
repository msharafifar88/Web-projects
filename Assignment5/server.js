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

// calling the express module
const express = require("express");
// calling the path module
const path = require("path");
// calling the data service module
const ds = require("./data-service.js");
// calling the multer module
const multer = require("multer");
// calling the file system module
const fs = require("fs");
// calling the body parser module
const bodyParser = require("body-parser");
// calling express-handlebars
const exphbs = require("express-handlebars");
// calling the data-service-auth.js module
const dataServiceAuth = require("./data-service-auth.js");
// calling client-sessions
const clientSessions = require('client-sessions');
// calling express
const app = express();
// declaring the http port
const HTTP_PORT = process.env.PORT || 8080;

// adding body parser middleware
app.use(bodyParser.urlencoded({ extended: true }));

// adding client-sessions middleware
app.use(clientSessions({
    cookieName: "session",
    secret: "web322_a6",
    duration: 2 * 60 * 1000,
    activeDuration: 60 * 1000
    })
);

// middleware function to ensure that all of the templates will have access to a "session" object
app.use(function(req, res, next) {
    res.locals.session = req.session;
    next();
});

// middleware function that checks if a user is logged in
function ensureLogin (req, res, next){
    if (!(req.session.user)){
        res.redirect("/login");
    }
    else{
        next();
    }
}

//how to handle .hbs files with express handlebars
app.engine('.hbs', exphbs({
    extname: '.hbs',
    defaultLayout: 'main',
    //This basically allows us to replace all of our existing navbar links, 
    //ie: <li><a href="/about">About</a></li> with code that looks like this {{#navLink "/about"}}About{{/navLink}}.
    helpers: {
        navLink: function (url, options) {
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
//specify view engine
app.set('view engine', '.hbs');

//defining a storage variable
const storage = multer.diskStorage({
    destination: "./public/images/uploaded",
    // we write the filename as the current date down to the millisecond
    // in a large web service this would possibly cause a problem if two people
    // uploaded an image at the exact same time. A better way would be to use GUID's for filenames.
    // this is a simple example.
    filename: function (req, file, cb) {
      cb(null, Date.now() + path.extname(file.originalname));
    }
  });

//defining an upload variable
let upload = multer({storage: storage});

//for your server to correctly return the "css/site.css" file
app.use(express.static("public")); 

//This will add the property "activeRoute" to "app.locals" whenever the route changes, 
//ie: if our route is "/employees/add", the app.locals.activeRoute value will be "/employees/add".
app.use(function(req,res,next){
    let route = req.baseUrl + req.path;
    app.locals.activeRoute = (route == "/") ? "/" : route.replace(/\/$/, "");
    next();
    });

//The route "/" renders the home view
app.get("/", function(req, res){
        res.render(path.join(__dirname, "/views/home.hbs"));
});

//The route "/about" must return the about.hbs file from the views folder
app.get("/about", (req, res) => {
    res.render(path.join(__dirname,"/views/about.hbs"));
}); 

//This route will return all the contents of the "./public/images/uploaded" directory (images)
app.get("/images", ensureLogin, function(req, res){
    var img = {
        imgArr: []
    };
    fs.readdir("./public/images/uploaded", (err, items) =>{     
        for (var i = 0; i < items.length; i++){
            img.imgArr.push(items[i]);
        }
        res.render("images", {data: img.imgArr});
    });
});

//This route simply sends the file "/views/addImage.hbs"
app.get("/images/add", ensureLogin, (req, res) =>{
    res.render(path.join(__dirname, "/views/addImage.hbs"));
});

//This route uses the middleware: upload.single("imageFile")
app.post("/images/add", ensureLogin, upload.single("imageFile"), (req, res) =>{
    res.redirect("/images");
});

// This route will return all of the employees within the employees.json file
app.get("/employees", ensureLogin, (req, res) => {

    if (req.query.status) {
        ds.getEmployeesByStatus(req.query.status).then((data) => {
            if (data.length > 0) {
            res.render("employees", {employees: data});
            }
            else{
                res.render("employees",{ message: "no results" });
            }
        }).catch((err) => {
            res.render("employees", {message: "no results"});
        });
    }
    else if (req.query.department) {
        ds.getEmployeesByDepartment(req.query.department).then((data) => {
            if (data.length > 0) {
                res.render("employees", {employees: data});
            }
            else{
                res.render("employees",{ message: "no results" });
            }
            
        }).catch((err) => {
            res.render("employees", {message: "no results"});
        });
    }
    else if (req.query.manager) {
        ds.getEmployeesByManager(req.query.manager).then((data) => {
            if (data.length > 0) {
            res.render("employees", {employees: data});
            }
            else{
                res.render("employees",{ message: "no results" });
            }
        }).catch((err) => {
            res.render("employees", {message: "no results"});
        });
    }
    else {
        ds.getAllEmployees().then((data) => {
            if (data.length > 0) {
                res.render("employees", {employees: data});
            }
            else{
                res.render("employees",{ message: "no results" });
            }
        }).catch((err) => {
            res.render("employees", {message: "no results"});
        });
    }
});

//This route simply sends the file "/views/addEmployee.hbs "
app.get("/employees/add", ensureLogin, function(req, res){
    ds.getDepartments().then((data) => {
        res.render("addEmployee", { departments: data });
    }).catch((err) => {
        res.render("addEmployee", { departments: [] });
    });
});

//This route makes a call to the (promise-driven) addEmployee(employeeData) function from your data-service.js module 
//and provide req.body as the parameter
app.post("/employees/add", ensureLogin, (req, res) => {
    console.log(req.body);
    ds.addEmployee(req.body).then((data) => {
        res.redirect("/employees");
    }).catch((err) => {
        res.render("employees",{ message: "no results" });
    });
});

// This route will show all the data from your form in the console, once the user clicks "Update Employee".
app.post("/employee/update", ensureLogin, (req, res) => {
    console.log(req.body);
    ds.updateEmployee(req.body).then(() => {
        res.redirect("/employees");
    }).catch((err)=>{
        res.status(500).send("Unable to Update Employee");
    });
});

// This route will return the employee whose employeeNum matches the value
app.get("/employee/:empNum", ensureLogin, (req, res) => {
    // initialize an empty object to store the values
    let viewData = {};
    ds.getEmployeeByNum(req.params.empNum).then((data) => {
        if (data) {
            viewData.employee = data; //store employee data in the "viewData" object as "employee"
        } else {
            viewData.employee = null; // set employee to null if none were returned
        }
    }).catch(() => {
        viewData.employee = null; // set employee to null if there was an error
    }).then(ds.getDepartments).catch(()=>{
        res.status(500).send("Unable to find the department");
    })
        .then((data) => {
            viewData.departments = data; // store department data in the "viewData" object as "departments"
            // loop through viewData.departments and once we have found the departmentId that matches
            // the employee's "department" value, add a "selected" property to the matching
            // viewData.departments object
            for (let i = 0; i < viewData.departments.length; i++) {
                if (viewData.departments[i].departmentId == viewData.employee.department) {
                    viewData.departments[i].selected = true;
                }
            }
        }).catch(() => {
            viewData.departments = []; // set departments to empty if there was an error
        }).then(() => {
            if (viewData.employee == null) { // if no employee - return an error
                res.status(404).send("Employee Not Found");
            } else {
                res.render("employee", { viewData: viewData }); // render the "employee" view
            }
        }).catch((err)=>{
            res.status(500).send("Unable to view the Employee");
         });
});

// This route will delete the employee whose empNum matches the value
app.get("/employees/delete/:empNum", ensureLogin, (req, res) => {
    ds.deleteEmployeeByNum(req.params.empNum).then((data) => {
        res.redirect("/employees");
    }).catch((err) => {
        res.status(500).send("Unable to Remove Employee / Employee not found");
    });   
});

// This route will return all of the departments within the departments.json file
app.get("/departments", ensureLogin, (req, res)=>{
    ds.getDepartments().then((data)=>{
        if (data.length > 0) {
            res.render("departments", {departments: data});
        }
        else{
            res.render("departments",{ message: "no results" });
        }
        }).catch((err)=>{
        res.render("departments", {message: "no results"});
    });
});

//This route simply sends the file "/views/addDepartment.hbs "
app.get("/departments/add", ensureLogin, (req, res) => {
    res.render("addDepartment",{title: "Department"});
});

//This route makes a call to the (promise-driven) addDepartment(departmentData) function from your data-service.js module 
//and provide req.body as the parameter
app.post("/departments/add", ensureLogin, (req, res) => {
    console.log(req.body);
    ds.addDepartment(req.body).then((data) => {
        res.redirect("/departments");
    }).catch((err) => {
        res.render("depertments", { message: "no results" });
    });
});

// This route will show all the data from your form in the console, once the user clicks "Update Department".
app.post("department/update", ensureLogin, (req, res) => {
    console.log(req.body);
    ds.updateDepartment(req.body).then(() => {
        res.redirect("/departments");
    }).catch((err)=>{
        res.status(500).send("Unable to Update Department");
    });
});

// This route will return the department whose departmentId matches the value
app.get("/department/:departmentId", ensureLogin, (req, res) => {
    ds.getDepartmentById(req.params.departmentId).then((data) => {
        res.render("department", { department: data });
    }).catch((err) => {
        res.status(404).send("Department Not Found");
    });
});

// This route will delete the department whose departmentId matches the value
app.get("/departments/delete/:departmentId", ensureLogin, (req, res) => {
    ds.deleteDepartmentById(req.params.departmentId).then((data) => {
        res.redirect("/departments");
    }).catch((err) => {
        res.status(500).send("Unable to Remove Department / Department not found");
    });
});

// This "GET" route simply renders the "login" view without any data
app.get("/login", (req,res)=>{
    res.render("login");
});

// This "GET" route simply renders the "register" view without any data
app.get("/register", (req,res)=>{
    res.render("register");
});

// This "POST" route will invoke the dataServiceAuth.RegisterUser(userData) method with the POST data
app.post("/register", (req,res)=>{
    dataServiceAuth.registerUser(req.body)
    .then(()=>{
        res.render("register", {successMessage: "User created"});
    })
    .catch((err)=>{
        res.render("register",{errorMessage: err, userName: JSON.stringify(req.body.userName)});
    })
});

// This "POST" route will invoke the dataServiceAuth.checkUser(userData) method with the POST data
app.post("/login", (req, res)=>{
    req.body.userAgent = req.get('User-Agent');
    dataServiceAuth.checkUser(req.body)
    .then((foundUser)=>{
        req.session.user = {
            userName: foundUser.userName,
            email: foundUser.email,
            loginHistory: foundUser.loginHistory
        };
        res.redirect('/employees');       
    })
    .catch((err)=>{
        res.render("login",{errorMessage: err, userName: req.body.userName} );
    });
});

// This "GET" route will simply "reset" the session
app.get("/logout", (req, res)=>{
    req.session.reset();
    res.redirect("/");
});

// This "GET" route simply renders the "userHistory" view without any data
app.get("/userHistory", ensureLogin, (req, res)=>{
    res.render("userHistory",{user: req.session.user});
});

// 404 "not found" error message
app.use((req, res) => {
    // use .end() instead of sendFile if you do not want to show a message to the client
    res.status(404).send("Page Not Found!"); 
});

// This function will read the contents of the "./data/employees.json" and "./data/departments.json" files
ds.initialize()
.then(dataServiceAuth.initialize)
.then(()=>{
    //Server listens on the defined HTTP_PORT and console logs a message upon connection
    app.listen(HTTP_PORT, function(){ 
        console.log("Express http server listening on " + HTTP_PORT);
    });
}).catch((err)=>{
    console.log(err);
});



