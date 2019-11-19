// calling mongoose 
const mongoose = require("mongoose");

// calling the "bcryptjs" 3rd party module
const bcrypt = require('bcryptjs');

// creating a Schema variable pointing to mongoose schema
const Schema  = mongoose.Schema;

// creating a user schema
let userSchema = new Schema({
    "userName":{
        "type": String,
        "unique": true
    },
    "password": String,
    "email": String,
    "loginHistory":[{
        "dateTime": Date,
        "userAgent": String
    }]
});

let User; // to be defined on new connection

// module initializing the connection to mongoDB database
module.exports.initialize = function () {
    return new Promise(function (resolve, reject) {
        let db = mongoose.createConnection("mongodb+srv://mohammad:5112191@web322a6-i4bps.mongodb.net/test?retryWrites=true&w=majority");
        db.on('error', (err) => {
            reject(err); // reject the promise with the provided error
        });
        db.once('open', () => {
            User = db.model("users", userSchema);
            resolve();
        });
    });
};

// Register User module
module.exports.registerUser = function (userData) {
    return new Promise(function (resolve, reject) {
        if (userData.password != userData.password2) {
            reject("Passwords do not match");
        }
        else {
            let newUser = new User(userData);
            bcrypt.genSalt(10, function (err, salt) {
                bcrypt.hash(userData.password, salt, function (err, hash) {
                    if (err) {
                        reject("There was an error encrypting the password");
                    }
                    else {
                        newUser.password = hash;
                        newUser.save()
                        .then(() => {
                            resolve();
                        })
                        .catch((err) => {
                            if (err.code == 11000) {
                                reject("User Name already taken");
                            }
                            else {
                                reject("There was an error creating the user:" + err);
                            }
                        });
                    }
                });
            });

        }
    });
}

// Check User module
module.exports.checkUser = function(userData) {
    return new Promise((resolve, reject) => {
        User.find({userName: userData.userName})
            .exec().then((users) => {
                if(!users){
                    reject('Unable to find user: '+userData.userName);
                }else{
                    bcrypt.compare(userData.password, users[0].password).then((res)=>{
                        if(res===true){
                            users[0].loginHistory.push({dateTime: (new Date()).toString(), userAgent: userData.userAgent});
                            User.update(
                                { userName: users[0].userName },
                                { $set: {loginHistory: users[0].loginHistory }},
                                { multi: false }
                            ).exec().then((() => {
                                resolve(users[0]);
                            })).catch((err) => {
                                reject("There was an error verifying the user: " + err);
                            });
                        } else{
                            reject('Incorrect Password for user: '+userData.userName);
                        }
                    })
                }
            }).catch(() => {
                reject('Unable to find user: '+userData.userName);
            })
    });
}