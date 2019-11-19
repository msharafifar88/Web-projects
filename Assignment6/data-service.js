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

// Models
const Employee = sequelize.define('Employee',{
    employeeNum:{
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    firstName: Sequelize.STRING,
    last_name: Sequelize.STRING,
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
    department: Sequelize.INTEGER,
    hireDate: Sequelize.STRING
     }   , {
        createdAt: false, // disable createdAt
        updatedAt: false // disable updatedAt
});

const Department = sequelize.define('Department',{
    departmentId:{
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    departmentName: Sequelize.STRING
    }   //, {
        //createdAt: false, // disable createdAt
        //updatedAt: false // disable updatedAt
//}
);

//---------------------------------------------------------------------
//     getAllEmployees function
//---------------------------------------------------------------------
module.exports.getAllEmployees = function() {
//*    console.log("getAllEmployees entrei ")
    return new Promise(function (resolve, reject) {
        sequelize.sync()
        .then(() => {
//*            console.log("getAllEmployees entrei - then ")
            resolve(Employee.findAll());
//*            console.log("lol")
        })
        .catch((err) => {
            console.log("getAllEmployees entrei - catch ")
            reject("no results returned.");
        });
    });
    }

//---------------------------------------------------------------------
//     getManagers function
//---------------------------------------------------------------------
module.exports.getManagers = function() { 
    return new Promise(function (resolve, reject) {
        sequelize.sync()
            .then(() => {
                resolve(Employee.findAll({
                    where:{ isManager: true }
                }));
            })
            .catch((err) => {
            reject("no results returned.")
            });
    });
}

//---------------------------------------------------------------------
//     getDepartments function
//---------------------------------------------------------------------
module.exports.getDepartments = function() {
    return new Promise(function (resolve, reject) {
        sequelize.sync()
            .then(() => {
                resolve(Department.findAll());
            })
            .catch((err) => {
                reject("no results returned.");
            });
    });
}

//---------------------------------------------------------------------
//     initialize function
//---------------------------------------------------------------------
module.exports.initialize = function () {
    return new Promise(function (resolve, reject) {
        sequelize.sync()
            .then((Employee) => {
                resolve();
            })
            .then((Department) => {
                resolve();
            })
            .catch((err) => {
                reject("unable to sync the database");
            });
//        reject();
    });
}

//---------------------------------------------------------------------
//     addEmployee function
//---------------------------------------------------------------------
    module.exports.addEmployee = function(employeeData) {
        employeeData.isManager = (employeeData.isManager) ? true : false;
        return new Promise(function (resolve, reject) {
            sequelize.sync()
            .then(() => {
                for (let i in employeeData) {
                    if(employeeData[i] == ""){
                        employeeData[i] = null;
                    }
                }
                resolve(Employee.create({
                    employeeNum: employeeData.employeeNum,
                    firstName: employeeData.firstName,
                    last_name: employeeData.last_name,
                    email: employeeData.email,
                    SSN: employeeData.SSN,
                    addressStreet: employeeData.addressStreet,
                    addressCity: employeeData.addressCity,
                    isManager: employeeData.isManager,
                    addressState: employeeData.addressState,
                    addressPostal: employeeData.addressPostal,
                    employeeManagerNum: employeeData.employeeManagerNum,
                    status: employeeData.status,
                    department: employeeData.department,
                    hireDate: employeeData.hireDate
                }));
            }).catch(() => {
                    reject("unable to create employee.");
            });
        }).catch(() => {
                reject("unable to create employee.");
        });
    }   

//---------------------------------------------------------------------
//     getEmployeesByStatus function
//---------------------------------------------------------------------
    module.exports.getEmployeesByStatus = (stat) => {
        return new Promise(function (resolve, reject) {
            sequelize.sync()
               .then(() => {
                    resolve(Employee.findAll({ where:{ status: stat }
                    }));
                })
                .catch((err) => {
                    reject("no results returned.");
                });
        });
    }

//---------------------------------------------------------------------
//     getEmployeesByDepartment function
//---------------------------------------------------------------------
module.exports.getEmployeesByDepartment = (dept) => {
    return new Promise(function (resolve, reject) {
        sequelize.sync()
        .then(() => {
            resolve(Employee.findAll({
                where:{ department: dept }
            }));
        })
        .catch((err) => {
            reject("no results returned.");
        });
    });
}

//---------------------------------------------------------------------
//     getEmployeesByManager function
//---------------------------------------------------------------------
module.exports.getEmployeesByManager = (mng) => { 
    return new Promise(function (resolve, reject) {
        sequelize.sync()
            .then(() => {
                resolve(Employee.findAll({
                    where:{ employeeManagerNum: mng }
                }));
            })
            .catch((err) => {
                reject("no results returned.");
            });
    });
}

//---------------------------------------------------------------------
//     getEmployeesByNum function
//---------------------------------------------------------------------
exports.getEmployeesByNum = (num) => {
    return new Promise(function (resolve, reject) {
        sequelize.sync()
            .then(() => {
                resolve(Employee.findAll({
                    where:{ employeeNum: num }
                }));
            })
            .catch((err) => {
                reject("no results returned.");
            });
    });
}


//---------------------------------------------------------------------
//     updateEmployee function
//---------------------------------------------------------------------
exports.updateEmployee = (employeeData) => {
    employeeData.isManager = (employeeData.isManager) ? true : false;
    return new Promise(function (resolve, reject) {
        sequelize.sync()
        .then(() => {
            for (let i in employeeData) {
                if(employeeData[i] == ""){
                    employeeData[i] = null;
                }
            }
            resolve(Employee.update({
                firstName: employeeData.firstName,
                last_name: employeeData.last_name,
                email: employeeData.email,
                addressStreet: employeeData.addressStreet,
                addressCity: employeeData.addressCity,
                addressPostal: employeeData.addressPostal,
                addressState: employeeData.addressState,
                isManager: employeeData.isManager,
                employeeManagerNum: employeeData.employeeManagerNum,
                status: employeeData.status,
                department: employeeData.departmentId
            }, 
            { where: { employeeNum: employeeData.employeeNum }}
            ));
        }).catch(() => {
            reject("unable to create employee.");
        });
    });
}


//---------------------------------------------------------------------
//     addDepartment function
//---------------------------------------------------------------------
module.exports.addDepartment = (departmentData) => {
    return new Promise((resolve, reject) => {
        sequelize.sync()
        .then(() => {
            for(let i in departmentData){
                if(departmentData[i] == "") {
                    departmentData[i] = null;
                }
            }
            Department.create({
                departmentId: departmentData.departmentId,
                departmentName: departmentData.departmentName
            })
            .then(() => {
                resolve(Department);
            })
            .catch((err) => {
                reject("unable to create department.");
            });
        })
        .catch(() => {
            reject("unable to create department.");
        });
    });
}


//---------------------------------------------------------------------
//     updateDepartment function
//---------------------------------------------------------------------
module.exports.updateDepartment = (departmentData) => {
    return new Promise((resolve, reject) => {
        sequelize.sync()
        .then(() => {
            for(let i in departmentData){
                if(departmentData[i] == "") {
                    departmentData[i] = null;
                }
            }
            Department.update({
                departmentName: departmentData.departmentName
            }, 
            { where: { departmentId: departmentData.departmentId }}
            )
            .then(() =>{
                resolve(Department[0]);
            })
            .catch((err) => {
                reject("unable to create department.");
            });
        })
        .catch(() => {
            reject("unable to create department.");
        });
    });
}

//---------------------------------------------------------------------
//     deleteEmployeeByNum function
//---------------------------------------------------------------------
module.exports.deleteEmployeeByNum = (empNum) =>{
    return new Promise((resolve, reject) => {
        sequelize.sync()
        .then(() => {
            resolve(Employee.destroy({
                where:{ employeeNum: empNum }
            }));
        })
        .catch((err) => {
            reject();
        });
    });
}

//---------------------------------------------------------------------
//     getDepartmentById function
//---------------------------------------------------------------------
module.exports.getDepartmentById = (deptid) => {
    return new Promise((resolve, reject) => {
        sequelize.sync()
        .then(() => {
            resolve(Department.findAll({
                where:{ departmentId: deptid }
            }));
        })
        .catch((err) => {
            reject("unable to find department");
        });
    });
}

//---------------------------------------------------------------------
//     deleteDepartmentByNum function
//---------------------------------------------------------------------
module.exports.deleteDepartmentByNum = (DeptNum) =>{
    return new Promise((resolve, reject) => {
        sequelize.sync()
        .then(() => {
            resolve(Department.destroy({
                where:{ departmentId : DeptNum }
            }));
        })
        .catch((err) => {
            reject();
        });
    });
}