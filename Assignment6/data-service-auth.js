var exports = module.exports = {};
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
const bcrypt = require('bcryptjs');
var userSchema = new Schema({
    "userName":{
        "type": String,
        "unique": true
    },
    "password": String,
    "email": String,
    "loginHistory": [{
        "dateTime":Date,
        "userAgent":String
    }]
});

let User; // to be defined on new connection (see initialize)

//---------------------------------------------------------------------
//     initialize function
//---------------------------------------------------------------------
exports.initialize = function(){ 
    return new Promise((resolve, reject) => {

        let db = mongoose.createConnection("mongodb+srv://rde-micheli:web322a6%2D@senecaweb322-t7oze.mongodb.net/test?retryWrites=true");

        db.on('error', (err)=>{
            
            reject(err); // reject the promise with the provided error
        });
        db.once('open', ()=>{
            
           User = db.model("users", userSchema);
           resolve();
        });
    });
}

//--------------------------------------------------------------------
//     registerUser function
//---------------------------------------------------------------------
exports.registerUser = function(userData){
    return new Promise((resolve, reject) => {
        if (userData.password != userData.password2){
            reject('Passwords do not match');
        } else {            // generate a "salt" using 10 rounds
            bcrypt.genSalt(10, function(err, salt){
                bcrypt.hash(userData.password, salt, function(err, hash){
                    if (err) {
                        reject('There was an error encrypting the password');
                    }
                    else {
                        userData.password = hash;
                        let newUser = new User(userData);
                        newUser.save((err) => {
                            if (err) {
                                if (err.code == 11000) {
                                    reject ( "User Name already taken" );
                                }
                                reject ( "There was an error creating the user: " + err );
                            }
                            else {
                                resolve();
                            }
                        })
                    }
                })
                
            })
        }     
    });
};

//---------------------------------------------------------------------
//     checkUser function
//---------------------------------------------------------------------
exports.checkUser = function(userData) {
    return new Promise((resolve, reject) => {
        User.find({userName: userData.userName})
            .exec().then((users) => {
                if (!users) {
                    reject( 'Unable to find user: ' + userData.userName );
                } else {
                    bcrypt.compare( userData.password, users[0].password).then((res) => {
                        if ( res === true ) {
                            users[0].loginHistory.push( { dateTime: (new Date()).toString(), userAgent: userData.userAgent });
                            User.update (
                                { userName: users[0].userName },
                                { $set: {loginHistory: users[0].loginHistory }},
                                { multi: false }
                            ).exec().then((() => {
                                resolve( users[0] );
                            })).catch(( err) => {
                                reject( "There was an error verifying the user: " + err );
                            });
                        } else {
                            reject( 'Incorrect Password for user: ' + userData.userName );
                        }
                    })
                }
            }).catch(() => {
                reject( 'Unable to find user: ' + userData.userName );
            })
    });
}