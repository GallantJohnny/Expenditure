const expensesCollection = require('../db').db().collection('expenses');
const ObjectId = require('mongodb').ObjectID;

let Expense = function (data, owner) {
    this.data = data;
    this.owner = owner;
    this.message = {
        errors: [],
        success: "",
    };
}

Expense.prototype.validate = function () {
    if (this.data.title === "") this.message.errors.push("Please provide a title.");
    if (this.data.ammount === "") this.message.errors.push("Please provide an ammount.");
    if (this.data.date === "") this.message.errors.push("Please provide a date.");
}

Expense.prototype.create = function () {
    return new Promise((resolve, reject) => {
        this.validate();
        if (!this.message.errors.length) {
            const dateArray = this.data.date.split('-');
            const date = new Date(dateArray[0], dateArray[1] - 1, dateArray[2]);
            const weekNumber = Expense.getNumberOfTheWeek(date);
            expensesCollection.insertOne({
                owner: ObjectId(this.owner),
                title: this.data.title,
                ammount: this.data.ammount,
                currency: this.data.currency,
                date: date,
                weekNumber: weekNumber
            }).then(() => {
                this.message.success = "Item created successfully!";
                resolve(this.message);
            }).catch(() => {
                this.message.errors.push("Something went wrong, try again...");
                reject(this.message);
            })
        } else {
            console.log(this.message);
            reject(this.message);
        }
    });
}

Expense.prototype.delete = function () {

}

Expense.prototype.modify = function () {

}

Expense.queryExpensesByWeekNumber = function (date, owner) {
    return new Promise(async (resolve, reject) => {
        const weekNumber = this.getNumberOfTheWeek(date);
        let expenses = [];
        let aggOperations = [
            { $match: { owner: new ObjectId(owner) } }
        ];

        let allExpenses = await expensesCollection.aggregate(aggOperations).toArray();

        allExpenses.forEach(expense => {
            if (weekNumber === expense.weekNumber) {
                expenses.push({
                    title: expense.title,
                    ammount: expense.ammount,
                    currency: expense.currency,
                    date: expense.date,
                    weekNumber: expense.weekNumber
                });
            }
        });

        const spent = this.calculateSpent(expenses);
        returnArray = [
            expenses,
            this.toCurrencyStyle(spent.toString()),
            this.toCurrencyStyle((25000 - spent).toString())
        ];

        expenses = expenses.map((expense) => {
            expense.ammount = this.toCurrencyStyle(expense.ammount);
        })

        console.log(returnArray);
        resolve(returnArray);
    });
}

Expense.toCurrencyStyle = function (string) {
    let formatedString = string.split("");
    let counter = 0;
    for (let i = string.length; i >= 0; i--) {
        if (counter === 3) {
            formatedString.splice(i, 0, " ");
            counter = 0;
        }
        counter += 1;
    }
    return formatedString.join('');
}

Expense.calculateSpent = function (expenses) {
    let spent = 0;
    expenses.forEach(expense => {
        spent += parseInt(expense.ammount);
    });
    return spent;
}

Expense.getNumberOfTheWeek = function (date) {
    let tdt = new Date(date.valueOf());
    let dayn = (date.getDay() + 6) % 7;
    tdt.setDate(tdt.getDate() - dayn + 3);
    let firstThursday = tdt.valueOf();
    tdt.setMonth(0, 1);
    if (tdt.getDay() !== 4) {
        tdt.setMonth(0, 1 + ((4 - tdt.getDay()) + 7) % 7);
    }
    return 1 + Math.ceil((firstThursday - tdt) / 604800000);
}

module.exports = Expense;