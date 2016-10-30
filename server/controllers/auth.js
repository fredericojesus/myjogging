'use strict';

var passport = require('passport');

module.exports = {
    login: login,
    signup: signup,
    logout: logout
};

function login(req, res, next) {
    passport.authenticate('login', function (err, user) {
        if (err) {
            console.log(err);
            return res.status(500).end();
        }
        if (user.error) {
            return res.status(403).send(user.error);
        }

        console.log('Logging in...');
        return req.logIn(user, function (err) {
            if (err) {
                console.log(err);
                return res.status(500).end();
            }
            res.send(req.user);
        });
    })(req, res, next);
}

function signup(req, res, next) {
    console.log('Creating new user...');
    passport.authenticate('signup', function (err, user) {
        if (err) {
            console.log(err);
            return res.status(500).end();
        }
        if (user.error) {
            console.log(user.error);
            return res.status(403).send(user.error);
        }

        console.log('User created, logging in now...');
        return req.logIn(user, function (err) {
            if (err) {
                console.log(err);
                return res.status(500).end();
            }
            res.send(req.user);
        });
    })(req, res, next);
}

function logout(req, res, next) {
    req.logout();
    console.log('User logged out');
    res.status(200).send(true);
}