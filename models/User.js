const bcrypt = require('bcryptjs');
const usersCollection = require('../db').db().collection("users");

let User = function (data) {
    this.data = data;
    this.errors = [];
}

User.prototype.login = function(){
    return new Promise((resolve, reject) => {
        usersCollection.findOne({username: this.data.username}).then((attemptedUser) => {
            if(attemptedUser && bcrypt.compareSync(this.data.password, attemptedUser.password)){
                resolve();
            } else {
                reject();
            }
        }).catch(function(){
            reject('Try again...');
        })
    })
}

module.exports = User;