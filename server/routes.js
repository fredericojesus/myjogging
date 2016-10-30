var router = require('express').Router();
var four0four = require('./utils/404')();

//CONTROLLERS
var auth = require('./controllers/auth.js');
var users = require('./controllers/users.js');
var jogs = require('./controllers/jogs.js');

//AUTH ROUTES
router.post('/login', auth.login);
router.post('/signup', auth.signup);
router.get('/logout', isAuthenticated, auth.logout);

//USERS ROUTES
router.get('/user', users.getCurrentUser);
router.get('/user/:alias', isAuthenticated, users.getUserByAlias);
router.put('/user/:_id', isAuthenticated, isAdmin, users.updateUser);
router.delete('/user/:_id', isAuthenticated, isAdmin, users.deleteUser);
router.get('/users', isAuthenticated, isManager, users.getUsers);

//JOGS ROUTES
router.get('/jogs', isAuthenticated, jogs.getJogs);
router.post('/jogs', isAuthenticated, jogs.createJog);
router.put('/jogs/:_id', isAuthenticated, jogs.updateJog);
router.delete('/jogs/:_id', isAuthenticated, jogs.deleteJog);

//FOUR0FOUR
router.get('/*', four0four.notFoundMiddleware);

module.exports = router;

// route middleware to ensure user is authenticated
function isAuthenticated(req, res, next) {
    if (req.isAuthenticated())
        return next();
    res.redirect('/');
}

// route middleware to ensure user is admin
function isAdmin(req, res, next) {
    if (req.user.hasRole('admin'))
        return next();
    res.redirect('/');
}

// route middleware to ensure user is manager or admin
function isManager(req, res, next) {
    if (req.user.hasRole('admin') || req.user.hasRole('manager'))
        return next();
    res.redirect('/');
}
