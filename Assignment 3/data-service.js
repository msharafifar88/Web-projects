var fs = require("fs");
var employees = [];
var departments = [];
var  check = [];

 
//     getAllEmployees function
 
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

 
//     getManagers function
 
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

 
//     getDepartments function
 
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

 
//     initialize function
 
module.exports.initialize = function () {
    var promise = new Promise(function(resolve,reject) {
        console.log("initialize function - started");
        
        try {
            fs.readFile('./data/employees.json', function(err,data) {
                if (err) {
                    
                    throw err;
                } else {
                employees = JSON.parse(data);
                
                }
            });
    
            fs.readFile('./data/departments.json',(err,data) => {
                if (err) {
                    
                    throw err;
                } else {
                departments = JSON.parse(data);
                
                }
            });
            
            resolve("initialize successfully");
        }
        catch (error) {
                reject("error ");
        }
    });
    return promise;
    }

 
//     addEmployee function
 
    module.exports.addEmployee = function(employeeData) {
        return new Promise(function (resolve, reject) {

            if (employeeData.isManager = (employeeData.isManager)) {
                employeeData.isManager = true;

            } else {
                employeeData.isManager = false;

            }

            employeeData.employeeNum = employees.length + 1;
            employees.push(employeeData);
            resolve();
        });   
    }   

 
//     getEmployeesByStatus function
 
    module.exports.getEmployeesByStatus = (status) => {
        return new Promise((resolve, reject) => {

            var  checklen =  check.length;

            for (var i = 0; i <  checklen; i++) {
                 check.pop();
            }
            for (var i = 0; i < employees.length; i++) {
                if (employees[i].status == status) {
                     check.push(employees[i] );
                }
            }
            if ( check.length > 0) {
                resolve( check);
            } else {
                reject(" No Results");
            }
            });
        }

 
//     getEmployeesByDepartment function
 
module.exports.getEmployeesByDepartment = (dept) => {
    return new Promise((resolve, reject) => {
        var  checklen =  check.length;
        for (var i = 0; i <  checklen; i++) {
             check.pop();
        }
        for (var i = 0; i < employees.length; i++) {
            if (employees[i].department == dept) {
                 check.push(employees[i] );
            }
        }
        if ( check.length > 0) {
            resolve( check);
        } else {
            reject(" No Results");
        } 
        });
    }

 
//     getEmployeesByManager function
 
module.exports.getEmployeesByManager = (mng) => { 
    return new Promise((resolve, reject) => {
        var  checklen =  check.length;
        for (var i = 0; i <  checklen; i++) {
             check.pop();
        }
        for (var i = 0; i < employees.length; i++) {
            if (employees[i].employeeManagerNum == mng) {
                 check.push(employees[i] );
            }
        }
        if ( check.length > 0) {
            resolve( check);
        } else {
            reject(" No Results");
        } 
        });
    }

 
//     getEmployeesByNum function
 
exports.getEmployeesByNum = (num) => {
    return new Promise((resolve,reject) => {
        var  checklen =  check.length;
        for (var i = 0; i <  checklen; i++) {
             check.pop();
        }
        found = false;
        for (var i = 0; i < employees.length && found == false; i++) {
            if (employees[i].employeeNum == num) {
                 check.push(employees[i]);
                found = true;
            }
        }
        if (found) {
            resolve( check);
        } else {
            reject(" No Results");
        }
        })
    }

