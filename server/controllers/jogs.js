'use strict';

var mongoose = require('mongoose');
var Jog = require('../models/jog.js');

module.exports = {
    getJogs: getJogs,
    createJog: createJog,
    updateJog: updateJog,
    deleteJog: deleteJog,
};

function getJogs(req, res, next) {
    console.log('Retrieving jogs...');

    var dateTo = new Date();
    dateTo.setHours(23);
    dateTo.setMinutes(59);
    var dateFrom = new Date();
    dateFrom.setHours(5);
    //if it's sunday (0) get jogs from last 6 days
    dateFrom.setDate(dateFrom.getDate() + 1 - (dateFrom.getDay() === 0 ? 7 : dateFrom.getDay()));
    var userId = req.user._id;

    if (req.query.dateFrom && req.query.dateTo) {
        dateFrom = new Date(req.query.dateFrom);
        dateTo = new Date(req.query.dateTo);
        dateTo.setHours(23);
        dateTo.setMinutes(59);
    }
    if (req.query.userId) {
        userId = req.query.userId;
    }

    Jog.aggregate({
        $match: {
            creator: mongoose.Types.ObjectId(userId),
            date: {
                $gte: dateFrom,
                $lte: dateTo
            },
        }
    }, {
        $sort: {
            date: -1,
        }
    }, function (err, result) {
        if (err) {
            console.log(err);
            return res.status(500).end();
        }

        if (result.length) {
            return res.status(200).send(result);
        }

        console.log('No jogs found between dates from ' + dateFrom.toLocaleDateString() + ' to ' + dateTo.toLocaleDateString() + '...')
        res.status(200).send();
    });
}

function createJog(req, res, next) {
    console.log('Creating jog...');

    if (req.user._id === req.params._id) {
        res.status(403).send();
    }

    var jog = new Jog({
        creator: req.query.userId,
        date: req.body.date,
        distance: req.body.distance,
        duration: req.body.duration
    });

    jog.save(req, function (err, jog) {
        if (err) {
            console.log(err);
            return res.status(500).end();
        }
        res.status(200).send(jog);
    });
}

function updateJog(req, res, next) {
    console.log('Updating jog...');

    Jog.findById(req.body._id, function (err, jog) {
        if (err) {
            console.log(err);
            return res.status(500).end();
        }

        jog.date = req.body.date;
        jog.distance = req.body.distance;
        jog.duration = req.body.duration;

        jog.save(function (err, jog) {
            if (err) {
                console.log(err);
                return res.status(500).end();
            }
            res.status(200).send(jog);
        });
    });
}

function deleteJog(req, res, next) {
    console.log('Deleting jog...');

    Jog.findByIdAndRemove(req.params._id, function (err, jog) {
        if (err) {
            console.log(err);
            return res.status(500).end();
        }

        res.status(200).send();
    });
}