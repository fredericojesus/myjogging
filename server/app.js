'use strict';

var express = require('express');
var app = express();
var session = require('express-session');
var passport = require('passport');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var favicon = require('serve-favicon');
var logger = require('morgan');
var port = process.env.PORT || 8080;
var four0four = require('./utils/404')();

var environment = process.env.NODE_ENV || 'dev';

app.use(favicon(__dirname + '/favicon.ico'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(logger('dev'));

require('./mongoose')();
require('./passport')(passport);

//required for passport
console.log('Setting up express-session');
app.use(session({
    secret: 'myjogging', // session secret
    resave: false,
    saveUninitialized: false
}));

console.log('Setting up Passport');
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions

app.use('/api', require('./routes'));

switch (environment) {
    case 'dist':
        console.log('** NODE DIST **');
        app.use(express.static('./dist/'));
        // Any invalid calls for templateUrls are under app/* and should return 404
        app.use('/app/*', function (req, res, next) {
            four0four.send404(req, res);
        });
        // Any deep link calls should return index.html
        app.use('/*', express.static('./build/index.html'));
        break;
    default:
        console.log('** NODE DEV **');
        app.use(express.static('./client/'));
        app.use(express.static('./'));
        app.use(express.static('./tmp'));
        // Any invalid calls for templateUrls are under app/* and should return 404
        app.use('/app/*', function (req, res, next) {
            four0four.send404(req, res);
        });
        // Any deep link calls should return index.html
        app.use('/*', express.static('./index.html'));
        break;
}

app.listen(port, function () {
    console.log('The magic happens on port ' + port);
});
