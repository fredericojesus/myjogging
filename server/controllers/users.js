'use strict';

var User = require('../models/user.js');

module.exports = {
    getCurrentUser: getCurrentUser,
    getUserByAlias: getUserByAlias,
    updateUser: updateUser,
    getUsers: getUsers,
    deleteUser: deleteUser
};

function getCurrentUser(req, res, next) {
    if (!req.isAuthenticated()) {
        return res.status(403).end();
    }

    res.status(200).send(req.user);
}

function getUserByAlias(req, res, next) {
    console.log('Getting user by alias (' + req.params.alias + ')...');

    User.find({ alias: req.params.alias }, function (err, user) {
        if (err) {
            console.log(err);
            return res.status(500).end();
        }

        if (user) {
            res.status(200).send(user[0]);
        } else {
            res.status(403).end();
        }

    });
}

function updateUser(req, res, next) {
    console.log('Updating user...');

    User.findOne({ 'alias': req.body.alias }, function (err, user) {
        if (err) {
            console.log(err);
            return res.status(500).end();
        }

        if (user) {
            return res.status(403).send({ error: 'That username is already taken.' });
        }

        User.findById(req.body._id, function (err, user) {
            if (err) {
                console.log(err);
                return res.status(500).end();
            }

            user.alias = req.body.alias;
            user.username = req.body.username;
            user.save({isUpdatingUser: true}, function (err, user) {
                if (err) {
                    console.log(err);
                    return res.status(500).end();
                }
                res.status(200).send(user);
            });
        });
    });
}

function getUsers(req, res, next) {
    console.log('Retrieving users...');

    User.find({}, function (err, users) {
        if (err) {
            console.log(err);
            return res.status(500).end();
        }

        res.status(200).send(users);
    });
}

function deleteUser(req, res, next) {
    console.log('Deleting user...');

    User.findById(req.params._id, function (err, user) {
        if (err) {
            console.log(err);
            return res.status(500).end();
        }

        user.remove(user, function (err) {
            if (err) {
                console.log(err);
                return res.status(500).end();
            }

            res.status(200).send();
        });
    });
}
