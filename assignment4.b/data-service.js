var fs = require("fs");
var employees = [];
var departments = [];
var aux = [];

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

//---------------------------------------------------------------------
//     addEmployee function
//---------------------------------------------------------------------
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

//---------------------------------------------------------------------
//     getEmployeesByStatus function
//---------------------------------------------------------------------
    module.exports.getEmployeesByStatus = (status) => {
        return new Promise((resolve, reject) => {
            var auxlen = aux.length;
            for (var i = 0; i < auxlen; i++) {
                aux.pop();
            }
            for (var i = 0; i < employees.length; i++) {
                if (employees[i].status == status) {
                    aux.push(employees[i] );
                }
            }
            if (aux.length > 0) {
                resolve(aux);
            } else {
                reject("no results returned.");
            }
            });
        }

//---------------------------------------------------------------------
//     getEmployeesByDepartment function
//---------------------------------------------------------------------
module.exports.getEmployeesByDepartment = (dept) => {
    return new Promise((resolve, reject) => {
        var auxlen = aux.length;
        for (var i = 0; i < auxlen; i++) {
            aux.pop();
        }
        for (var i = 0; i < employees.length; i++) {
            if (employees[i].department == dept) {
                aux.push(employees[i] );
            }
        }
        if (aux.length > 0) {
            resolve(aux);
        } else {
            reject("no results returned.");
        } 
        });
    }

//---------------------------------------------------------------------
//     getEmployeesByManager function
//---------------------------------------------------------------------
module.exports.getEmployeesByManager = (mng) => { 
    return new Promise((resolve, reject) => {
        var auxlen = aux.length;
        for (var i = 0; i < auxlen; i++) {
            aux.pop();
        }
        for (var i = 0; i < employees.length; i++) {
            if (employees[i].employeeManagerNum == mng) {
                aux.push(employees[i] );
            }
        }
        if (aux.length > 0) {
            resolve(aux);
        } else {
            reject("no results returned.");
        } 
        });
    }

//---------------------------------------------------------------------
//     getEmployeesByNum function
//---------------------------------------------------------------------
exports.getEmployeesByNum = (num) => {
    return new Promise((resolve,reject) => {
        var i2 = -1;
        for (var i = 0; i < employees.length; i++) {
            if (employees[i].employeeNum == num) {
                i2 = i;
                i = employees.length;
            }
        }

        if (i2 != -1) {
            resolve(employees[i2]);
        } else {
            reject("no results returned.");
        }
        })
    }

/*
exports.getEmployeesByNum = (num) => {
    return new Promise((resolve,reject) => {
        var auxlen = aux.length;
        for (var i = 0; i < auxlen; i++) {
            aux.pop();
        }
        found = false;
        for (var i = 0; i < employees.length && found == false; i++) {
            if (employees[i].employeeNum == num) {
                aux.push(employees[i]);
                found = true;
            }
        }
        if (found) {
            resolve(aux);
        } else {
            reject("no results returned.");
        }
        })
    }
*/

//---------------------------------------------------------------------
//     updateEmployee function
//---------------------------------------------------------------------
exports.updateEmployee = (updtData) => {
    return new Promise((resolve,reject) => {
        var i2 = -1;
        for (var i = 0; i < employees.length; i++) {
            if (updtData.employeeNum == employees[i].employeeNum) {
                employees[i] = updtData;
                i2 = i;
                i = employees.length;
                resolve();
            }
        }

        if (i2 == -1) {
            reject("Error updating Employees")
        }
    })
}

