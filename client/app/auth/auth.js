(function () {
    'use strict';

    angular
        .module('app.auth')
        .factory('authService', authService);

    /*@ngInject*/
    function authService($http, $q, User, jogsCache) {
        var _currentUser;

        var service = {
            currentUser: currentUser,
            getCurrentUser: getCurrentUser,
            isAuthenticated: isAuthenticated,
            isAuthorized: isAuthorized,
            authenticateUser: authenticateUser,
            signupUser: signupUser,
            logout: logout
        };

        return service;

        
        /**
         * Returns the currrent user
         * return {Object}
         */
        function currentUser() {
            return _currentUser;
        }

        /**
         * Get the current user
         * return {Promise}
         */
        function getCurrentUser() {
            var dfd = $q.defer();
            
            if (!!_currentUser) {
                dfd.resolve(_currentUser);
            } else {
                $http.get('/api/user')
                    .then(function (response) {
                        _currentUser = new User();
                        angular.extend(_currentUser, response.data);
                        dfd.resolve(_currentUser);
                    }).catch(function (response) {
                        dfd.reject(response.data);
                    });
            }
            
            return dfd.promise;
        }

        /**
         * Returns true if user is authenticated
         * return {Boolean}
         */
        function isAuthenticated() {
            return !!_currentUser;
        }

        /**
         * Return true if user has the specified role
         * @param {String} role
         * @return {Boolean}
         */
        function isAuthorized(role) {
            return !!_currentUser && _currentUser.roles.indexOf(role) > -1;
        }

        /**
         * Authenticates the user
         * @param {String} username
         * @param {String} password
         * @return {Promise}
         */
        function authenticateUser(username, password) {
            var dfd = $q.defer();
            
            $http.post('/api/login', {
                username: username,
                password: password
            }).then(function (response) {
                _currentUser = new User();
                angular.extend(_currentUser, response.data);
                dfd.resolve();
            }).catch(function (response) {
                dfd.reject(response.data);
            });
            
            return dfd.promise;
        }
        
        /**
         * Creates and authenticates the user
         * @param {String} username
         * @param {String} password
         * @return {Promise}
         */
        function signupUser(username, password) {
            var dfd = $q.defer();
            
            $http.post('/api/signup', {
                username: username,
                password: password
            }).then(function (response) {
                _currentUser = new User();
                angular.extend(_currentUser, response.data);
                dfd.resolve();
            }).catch(function (response) {
                dfd.reject(response.data);
            });
            
            return dfd.promise;
        }
        
        /**
         * Logout the user
         * @return {Promise}
         */
        function logout() {
            var dfd = $q.defer();
            
            $http.get('/api/logout')
                .then(function (response) {
                    _currentUser = undefined;
                    jogsCache.resetCache();
                    dfd.resolve();
                }).catch(function (response) {
                    console.log(response.data);
                    dfd.reject(response.data);
                });
            
            return dfd.promise;
        }
    }

})();
