const Sequelize = require('sequelize');
var sequelize = new Sequelize('daf9i8u3ikcd2u', 'mwqevfqyiyayhz', '2336d3a6dfb740e7bc09310ce6985f178220663829cde428e4566700b2bf0e2b', {
    host: 'ec2-107-21-216-112.compute-1.amazonaws.com',
    dialect: 'postgres',
    port: 5432,
    dialectOptions: {
    ssl: true,
    operatorsAliases: false
    }
   });

// Creating Data Model Employee
const Employee = sequelize.define('Employee',{
    employeeNum:{
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    firstName: Sequelize.STRING,
    lastName: Sequelize.STRING,
    email: Sequelize.STRING,
    SSN: Sequelize.STRING,
    addressStreet: Sequelize.STRING,
    addressCity: Sequelize.STRING,
    addressState: Sequelize.STRING,
    addressPostal: Sequelize.STRING,
    matritalStatus: Sequelize.STRING,
    isManager: Sequelize.BOOLEAN,
    employeeManagerNum: Sequelize.INTEGER,
    status: Sequelize.STRING,
    hireDate: Sequelize.STRING
    // ,department: Sequelize.INTEGER
    });

// Creating Data Model Department (Each department has many employees)
const Department = sequelize.define('Department',{
    departmentId:{
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    departmentName: Sequelize.STRING
    });

// Since a department can have many employees, we must define a relationship between Employees and Departments
// This will ensure that our Employee model gets a "department" column that will act as a foreign key to the Department model
Department.hasMany(Employee, {foreignKey: 'department'});

// This function will read the contents of the "./data/employees.json" and "./data/departments.json" files
module.exports.initialize= function() {

    return new Promise(function (resolve, reject) {
        sequelize.sync().then(() => {
            resolve();
        }).catch((err) => {
            reject("unable to sync the database");
        });
    });
}

module.exports.getAllEmployees = function() {
    return new Promise(function (resolve, reject) {
        Employee.findAll()
            .then((data) => {
                resolve(data);
            })
            .catch((err) => {
                reject("no results returned");
        });
    });
}

module.exports.getEmployeesByStatus = function(status){
    return new Promise(function (resolve, reject) {
            Employee.findAll({
                where: { status: status }
            })
        .then((data)=>{
            resolve(data);
        })
        .catch((err) => {
            reject("no results returned.");
        });
    });
}

module.exports.getEmployeesByDepartment = function(department){
    return new Promise(function (resolve, reject) {
        Employee.findAll({
            where: { department: department }
        }).then((data) => {
            resolve(data);
        }).catch((err) => {
            reject("no results returned");
        });
    });
}

module.exports.getEmployeesByManager = function(manager){
    return new Promise(function (resolve, reject) {
        Employee.findAll({
            where: { employeeManagerNum: manager }
        }).then((data) => {
            resolve(data);
        }).catch((err) => {
            reject("no results returned");
        });
    });
}

module.exports.getEmployeeByNum = function(num){
    return new Promise(function (resolve, reject) {
        Employee.findAll({
            where: { employeeNum: num }
        }).then((data) => {
            resolve(data[0]);
        }).catch((err) => {
            reject("no results returned");
        });
    });
}

module.exports.getDepartments = function(){
    return new Promise(function (resolve, reject) {
        Department.findAll()
        .then((data) => {
            resolve(data);
        }).catch((err) => {
            reject("no results returned");
        });
    });
}


module.exports.addEmployee = function (employeeData) {
    return new Promise(function (resolve, reject) {
        // ensure that the isManager property is set properly
        employeeData.isManager = (employeeData.isManager) ? true : false;
        // ensure that any blank values ("") for properties are set to null
        for (let i in employeeData) {
            if (employeeData[i] == "") {
                employeeData[i] = null;
            }
        }
        Employee.create(employeeData)
            .then(() => {
                resolve();
            })
            .catch((err) => {
                reject("unable to create employee");
            });
    });
}

module.exports.updateEmployee = function(employeeData){
    return new Promise(function (resolve, reject) {
        // ensure that the isManager property is set properly
        employeeData.isManager = (employeeData.isManager) ? true : false;
        // ensure that any blank values ("") for properties are set to null
        for (let i in employeeData) {
            if (employeeData[i] == "") {
                employeeData[i] = null;
            }
        }
        Employee.update(employeeData, {
            where: { employeeNum: employeeData.employeeNum } 
        })
        .then(() => {
            resolve();
        })
        .catch((err) => {
            reject("unable to update employee");
        });
    });
}

module.exports.addDepartment = (departmentData) => {
    return new Promise((resolve, reject) => {
        // ensure that any blank values ("") for properties are set to null
        for(let i in departmentData){
            if(departmentData[i] == "") {
                departmentData[i] = null;
            }
        }
        Department.create({
            departmentId: departmentData.departmentId,
            departmentName: departmentData.departmentName
        }).then(() => {
            resolve(Department);
        }).catch((err) => {
            reject("unable to create department.");
        });
    });
}

module.exports.updateDepartment = (departmentData) => {
    return new Promise((resolve, reject) => {
        // ensure that any blank values ("") for properties are set to null
        for(let i in departmentData){
            if(departmentData[i] == "") {
                departmentData[i] = null;
            }
        }
        Department.update({
            departmentName: departmentData.departmentName
        }, { where: {departmentId: departmentData.departmentId}
        }).then(() =>{
            resolve(Department);
        }).catch((err) => {
            reject("unable to create department.");
        });
    });
}

module.exports.getDepartmentById = (id) => {
    return new Promise((resolve, reject) => {
        Department.findAll({
            where: { departmentId: id }
        }).then((data) => {
            resolve(data[0]);
        }).catch((err) => {
            reject("no results returned");
        });
    });
}

module.exports.deleteDepartmentById = (id) => {
    return new Promise(function (resolve, reject) {
        Department.destroy({
            where: { departmentId: id }
        }).then(() => {
            resolve();
        })
        .catch((err) => {
            reject("Unable to delete department");
        });
    });
}

module.exports.deleteEmployeeByNum = (empNum) => {
    return new Promise(function (resolve, reject) {
        Employee.destroy({
            where: { employeeNum: empNum }
        }).then(function () {
            resolve();
        })
        .catch(function (err) {
            reject("unable to delete employee");
        });
    });
}