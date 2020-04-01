const mongodb = require('mongodb');

mongodb.connect('mongodb+srv://todoAppUser:12Roland12@cluster0-fidtp.mongodb.net/Expenditure?retryWrites=true&w=majority', {useNewUrlParser: true, useUnifiedTopology: true}, function(err, client){
    // first connect to MongoDB
    module.exports = client;
    // than start app.js and listen
    const app = require('./app');
    app.listen(3000);
});