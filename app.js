const express = require('express');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const app = express();
const router = require("./router");

let sessionOptions = session({
    secret: "JavaScript is so cool",
    store: new MongoStore({client: require('./db')}),
    resave: false,
    saveUninitialized: false,
    cookie: {maxAge: 1000 * 60 * 60 * 24, httpOnly: true}
})

app.use(sessionOptions);

app.use(function(req, res, next){
    // make current user id available on the req object
    if(req.session.user) {req.visitorId = req.session.user._id} else {req.visitorId = 0}

    // Make user session data available globally
    res.locals.user = req.session.user;
    next();
});

app.use(express.urlencoded({extended: false}));
app.use(express.json());

app.use(express.static('public'));
app.set('views', 'views');
app.set('view engine', 'ejs');

app.use('/', router);

module.exports = app;