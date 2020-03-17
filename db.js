const mongodb = require('mongodb');
const connectionString = 'mongodb+srv://todoAppUser:12Roland12@cluster0-fidtp.mongodb.net/Expenditure?retryWrites=true&w=majority';

mongodb.connect(connectionString, { useNewUrlParser: true, useUnifiedTopology: true }, function (err, client) {
    if (!err) {
        // first connect to MongoDB
        module.exports = client;
        // than start app.js and listen
        const app = require('./app');
        app.listen(3000);
    } else {
        console.log(err);
    }
});