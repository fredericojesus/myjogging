var mongoose = require('mongoose');
var Schema = mongoose.Schema;

//schema for jog model
var jogSchema = Schema({
    name: String,
    creator: { type: Schema.Types.ObjectId, ref: 'User' },
    date: Date,
    distance: Number,
    duration: Number, //time in seconds
    createdOn: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Jog', jogSchema);