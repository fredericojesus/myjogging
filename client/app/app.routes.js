(function () {
    'use strict';

    angular
        .module('app')
        .config(configRoutes)
        .run(runRoutes);

    /*@ngInject*/
    function configRoutes($stateProvider, $urlRouterProvider, $locationProvider) {
        var contentPath = 'app/';

        // Remove # from URL
        $locationProvider.html5Mode({
            enabled: true,
            requireBase: false
        });

        // For any unmatched url, redirect to /
        $urlRouterProvider.otherwise('/');

        // States
        $stateProvider
            .state('main', {
                url: '/',
                templateUrl: contentPath + 'main/main.html',
                controller: 'MainController',
                resolve: {
                    isAuthorized: function () {
                        return true;
                    },
                    setUserShown: ['authService', 'userShown', function (authService, userShown) {
                        return authService.getCurrentUser()
                            .then(function (user) {
                                return userShown.setUserShown(user);
                            }).catch(function () {
                                return false;
                            });
                    }]
                }
            })
            .state('admin', {
                url: '/admin',
                templateUrl: contentPath + 'admin/admin.html',
                controller: 'AdminController',
                resolve: {
                    isAuthorized: isAuthorized
                }
            })
            .state('auth', {
                url: '/auth',
                templateUrl: contentPath + 'auth/auth.html',
                controller: 'AuthController'
            })
            .state('user', {
                url: '/:username',
                templateUrl: contentPath + 'main/main.html',
                controller: 'MainController',
                resolve: {
                    isAuthorized: isAuthorized,
                    setUserShown: ['$stateParams', '$q', 'User', 'userShown', function ($stateParams, $q, User, userShown) {
                        var dfd = $q.defer();
                        User.getByAlias({ alias: $stateParams.username.toLowerCase() }).$promise
                            .then(function (user) {
                                dfd.resolve(userShown.setUserShown(user));
                            }).catch(function (err) {
                                dfd.reject();
                            });
                        return dfd.promise;
                    }]
                }
            });

        /*ngInject*/
        function isAuthorized(authService) {
            return authService.getCurrentUser()
                .then(function () {
                    return authService.isAuthorized('manager') || authService.isAuthorized('admin');
                }).catch(function () {
                    return false;
                });
        }
    }

    /*@ngInject*/
    function runRoutes($rootScope, $state, authService) {
        $rootScope.$on('$stateChangeStart', stateChangeStartCallback);

        function stateChangeStartCallback(event, toState, toParams, fromState, fromParams, options) {
            authService.getCurrentUser()
                //user is logged in
                .then(function () {
                    //redirects to / if user trying to access auth
                    if (toState.name === 'auth') {
                        event.preventDefault();
                        $state.go('main');
                    }

                })
                //user is not logged in
                .catch(function () {
                    //redirects the user to signup screen if trying to access another page
                    if (toState.name !== 'auth') {
                        event.preventDefault();
                        $state.go('auth');
                    }
                });
        }
    }
})();