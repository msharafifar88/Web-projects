var fs = require("fs");
var employees = [];
var departments = [];

module.exports.initialize = function () {
    var promise = new Promise(function(resolve,reject) {
        try {
            fs.readFile('./data/employees.json', function(err,data) {
                if (err)  throw err.message;
                employees = JSON.parse(data);
            });
    
            fs.readFile('./data/departments.json',(err,data) => {
                if (err) throw err.message;
                departments = JSON.parse(data);
            });
            resolve("Initialization OK");
        }
        catch (error) {
                reject("Initialization not OK");
        }
    });
    return promise;
    }
    
module.exports.getAllEmployees = function() {
    var promise = new Promise((resolve,reject) => {
        if (employees.length == 0) {
            var msgerr = "No data for employees"
            reject(msgerr);
        } else
        resolve (employees);
    })
    return promise;
}

module.exports.getManagers = function() {
    var managers = []; 
    var promise = new Promise((resolve,reject) => {
        for (var i = 0; i < employees.length; i++) {
            if (employees[i].isManager) {
                managers.push(employees[i]);
            }
        }     
    
        if (managers.length == 0) {  
            var msgerr = "No managers";
            reject(msgerr);
        } else
        resolve (managers);
    })
    return promise;
}

module.exports.getDepartments = function() {
    var promise = new Promise((resolve,reject) => {
        if (departments.length == 0) {
            var msgerr = "No departments";
            reject(msgerr);
        } else
        resolve (departments);
    })
    return promise;
}