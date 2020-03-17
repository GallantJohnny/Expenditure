const User = require('../models/User');

exports.home = function(req, res){
    res.render('home');
}

exports.login = function(req, res){
    let user = new User(req.body);
    user.login().then(function(){
        res.render('user-expenditure');
    }).catch(function(){
        res.send("Login failed");
    })
}