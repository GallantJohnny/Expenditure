const express = require('express');
const router = express.Router();
const userController = require("./controllers/userController");
const expenseController = require("./controllers/expenseController");

// User
router.get('/', userController.home);
router.get('/profile', userController.home, userController.userExpenses);
router.get('/register', function(req, res){res.render('register', {regErrors: []})});
router.post('/register', userController.register);
router.post('/login', userController.login);
router.get('/logout', userController.logout);

// Expenses
router.get('/new-item', expenseController.viewCreateScreen);
router.post('/create-item', expenseController.create);
router.post('/fetchExpenses', expenseController.fetchExpenditureByDate);

module.exports = router;