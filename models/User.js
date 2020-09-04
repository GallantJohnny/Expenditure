const validator = require('validator');
const bcrypt = require('bcryptjs');
const usersCollection = require('../db').db().collection("users");

let User = function (data) {
    this.data = data;
    this.errors = [];
}

User.prototype.validate = function () {
    return new Promise(async (resolve, reject) => {
        if (this.data.email === "") {
            this.errors.push("You must provide an email!");
        }
        if (!validator.isEmail(this.data.email)) {
            this.errors.push("You must provide a valid email!");
        }
        if (this.data.password === "") {
            this.errors.push('You must provide a password.')
        }
        if (this.data.password.length <= 6) {
            this.errors.push('Password must be at least 6 characters.');
        }
        if (this.data.password.length > 50) {
            this.errors.push("Password cannot exceed 50 characters!");
        }
        if (validator.isEmail(this.data.email)) {
            let emailExists = await usersCollection.findOne({ email: this.data.email });
            if (emailExists) { this.errors.push('That email is alredy being used!') }
        }
        resolve();
    });
}

User.prototype.login = function () {
    return new Promise(async (resolve, reject) => {
        await this.validate();
        usersCollection.findOne({ email: this.data.email }).then((attemptedUser) => {
            if (attemptedUser && bcrypt.compareSync(this.data.password, attemptedUser.password)) {
                this.data = attemptedUser;
                resolve('Congrats');
            } else {
                reject('Invalid email and password !');
            }
        }).catch(function () {
            reject("Something went wrong, try again later...");
        });
    })
}

User.prototype.register = function () {
    return new Promise(async (resolve, reject) => {
        await this.validate();
        if (!this.errors.length) {
            await usersCollection.insertOne({ email: this.data.email, password: await bcrypt.hash(this.data.password, 10) });
            resolve();
        } else {
            reject(this.errors);
        }
    })
}

/*User.prototype.showProfile = function () {
    return new Promise((resolve, reject) => {
        usersCollection.findOne
    })
}*/

module.exports = User;