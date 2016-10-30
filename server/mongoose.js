var mongoose = require('mongoose');
module.exports = function () {
    var dbPath = 'mongodb://localhost/myjoggingDB';
    
    mongoose.set('debug', false);
    // connect to our database
    mongoose.connect(dbPath);
    
    var db = mongoose.connection;
    db.on('error', function (err) {
        console.error(err.toString());
    });
    db.once('open', function () {
        console.log('DB connection opened on ' + dbPath);
    });
}