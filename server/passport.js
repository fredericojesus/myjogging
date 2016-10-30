var LocalStrategy = require('passport-local').Strategy;

// load up the user model
var User = require('./models/user');

module.exports = function (passport) {

    // =========================================================================
    // passport session setup ==================================================
    // =========================================================================
    // required for persistent login sessions
    // passport needs ability to serialize and unserialize users out of session

    // used to serialize the user for the session
    passport.serializeUser(function (user, done) {
        done(null, user._id);
    });

    // used to deserialize the user
    passport.deserializeUser(function (id, done) {
        User.findById(id, function (err, user) {
            done(err, user);
        });
    });

    // =========================================================================
    // LOCAL LOGIN =============================================================
    // =========================================================================
    passport.use('login', new LocalStrategy(
        function (username, password, done) {
            var alias = username.toLowerCase();

            // asynchronous
            process.nextTick(function () {
                User.findOne({ 'alias': alias }, function (err, user) {
                    if (err) {
                        return done(err);
                    }

                    if (!user) {
                        return done(null, { error: 'User not found.' });
                    }

                    if (!user.password || !user.isValidPassword(password)) {
                        return done(null, { error: 'Oops! Wrong password.' });
                    }

                    return done(null, user);
                });
            });
        }
    ));

    // =========================================================================
    // LOCAL SIGNUP =============================================================
    // =========================================================================
    passport.use('signup', new LocalStrategy(
        function (username, password, done) {
            // use lower-case usernames to avoid case-sensitive username matching
            var alias = username.toLowerCase();

            // asynchronous
            process.nextTick(function () {
                User.findOne({ 'alias': alias }, function (err, user) {
                    if (err) {
                        return done(err);
                    }

                    if (user) {
                        return done(null, { error: 'That username is already taken.' });
                    }

                    // create user
                    var newUser = new User();
                    newUser.alias = alias;
                    newUser.username = username;
                    newUser.password = newUser.generateHash(password);
                    newUser.save(function (err) {
                        if (err)
                            throw err;
                        return done(null, newUser);
                    });
                });
            });
        }
    ));
};