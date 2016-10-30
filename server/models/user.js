var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt-nodejs');
var Jog = require('./jog.js');

//schema for user model
var userSchema = Schema({
    username: String,
    alias: String,
    password: String,
    roles: [String],
    createdOn: { type: Date, default: Date.now }
});

userSchema.pre('save', function (next, data) {
    if (data.isUpdatingUser) {
        return next();
    }
    this.roles = [];
    this.roles.push('regular');

    next();
});
userSchema.pre('remove', true, deleteUserJogs);

//methods
//generating a hash
userSchema.methods.generateHash = function (password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

//checking if password is valid
userSchema.methods.isValidPassword = function (password) {
    return bcrypt.compareSync(password, this.password);
};

//checking if a user has a role
userSchema.methods.hasRole = function (role) {
    return this.roles.indexOf(role) > -1;
};

module.exports = mongoose.model('User', userSchema);

function deleteUserJogs(next, done, user) {
    console.log('Deleting ' + user.username + ' jogs...');
    next();

    Jog.remove({creator: user._id}, function (err) {
        if (err) {
            return next(err);
        }

        return done();
    });
}