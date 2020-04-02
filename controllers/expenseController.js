const Expense = require('../models/Expense');

exports.viewCreateScreen = function (req, res) {
    message = { errors: [], success: "" };
    res.render('create-item', { message: message });
}

exports.create = async function (req, res) {
    let expense = new Expense(req.body, req.session.user._id);
    expense.create().then(function (message) {
        res.render('create-item', { message: message });
    }).catch((message) => {
        res.render('create-item', { message: message });
    })
}

exports.fetchExpenditureByDate = function (req, res) {
       Expense.queryExpensesByWeekNumber(new Date(req.body.date), req.session.user._id).then((response) => {
           res.json(response);
        }).catch((e) => console.log(e));
}