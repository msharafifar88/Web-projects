var fs = require("fs");
var employees = [];
var departments = [];

//---------------------------------------------------------------------
//     getAllEmployees function
//---------------------------------------------------------------------
module.exports.getAllEmployees = function() {
    var promise = new Promise((resolve,reject) => {
        if (employees.length == 0) {
            var errmsg = "getAllEmployees function - There is no data. Empty file"
            console.log(errmsg);
            reject(errmsg);
        } else
        resolve (employees);
    })
    return promise;
}

//---------------------------------------------------------------------
//     getManagers function
//---------------------------------------------------------------------
module.exports.getManagers = function() {
    var managers = []; 
    var promise = new Promise((resolve,reject) => {
        for (var i = 0; i < employees.length; i++) {
            if (employees[i].isManager) {
                managers.push(employees[i]);
            }
        }     
    
        if (managers.length == 0) {  
            var errmsg = "getManagers function - There is no data.";
            console.log(errmsg);
            reject(errmsg);
        } else
        resolve (managers);
    })
    return promise;
}

//---------------------------------------------------------------------
//     getDepartments function
//---------------------------------------------------------------------
module.exports.getDepartments = function() {
    var promise = new Promise((resolve,reject) => {
        if (departments.length == 0) {
            var errmsg = "Function getDepartments - There is no data.";
            console.log(errmsg);
            reject(errmsg);
        } else
        resolve (departments);
    })
    return promise;
}

//---------------------------------------------------------------------
//     initialize function
//---------------------------------------------------------------------
module.exports.initialize = function () {
    var promise = new Promise(function(resolve,reject) {
        console.log("initialize function - started");
        
        try {
            fs.readFile('./data/employees.json', function(err,data) {
                if (err) {
                    console.log("initialize function - employees file error");
                    throw err;
                } else {
                employees = JSON.parse(data);
                console.log("initialize function - employees data loaded");
                }
            });
    
            fs.readFile('./data/departments.json',(err,data) => {
                if (err) {
                    console.log("initialize function - departments file error");
                    throw err;
                } else {
                departments = JSON.parse(data);
                console.log("initialize function - departments data loaded");
                }
            });
            console.log("initialize function executed successfully");
            resolve("initialize function executed successfully");
        }
        catch (error) {
                reject("initialize function failed");
        }
    });
    return promise;
    }
    