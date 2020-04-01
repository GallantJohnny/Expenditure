const User = require('../models/User');
const Expense = require('../models/Expense');

exports.home = function (req, res) {
    if(req.session.user){
        Expense.queryExpensesByWeekNumber(new Date(), req.session.user._id).then((returnArray) => {
            res.render('user-home', {expenses: returnArray[0], spent: returnArray[1], remaining: returnArray[2]});
        }).catch(() => {
            res.render('user-home', {expenses: [], spent: [], remaining: []});
        });

        
    } else {
        res.render('home', {error: ""});
    }
}

exports.register = function (req, res) {
    if (req.body.password === req.body.passwordConfm) {
        let newUser = new User(req.body);
        newUser.register().then(() => {
            req.session.user = {email: newUser.data.email, _id: newUser.data._id};
            req.session.save(function (){
                res.redirect('/');
            });
        }).catch(e => {
            res.render('register', { regErrors: e });
        });
    } else {
        console.log('password does not match');
    }
}

exports.login = function (req, res) {
    let user = new User(req.body);
    user.login().then(() => {
        req.session.user = {email: user.data.email, _id: user.data._id};
        req.session.save(function (){
            res.redirect('/');
        });
    }).catch((e) => {
        res.render('home', {error: e});
    });
}

exports.logout = function (req, res) {
    req.session.destroy(function () {
        res.redirect('/');
    });
}

exports.userExpenses = function (req, res) {

}