(function () {
    'use strict';

    angular
        .module('app.auth')
        .factory('User', user);

    /*@ngInject*/
    function user($resource) {
        var baseUrl = '/api/user';
        var userResource = $resource(baseUrl + '/:_id', { _id: '@_id' }, {
            getByAlias: { url: baseUrl + '/:alias', method: 'GET', isArray: false, params: { alias: '@alias'} },
            update: { method: 'PUT', isArray: false },
            getUsers: { url: '/api/users', method: 'GET', isArray: true}
        });

        userResource.prototype.hasRole = function (role) {
            return this.roles && this.roles.indexOf(role) > -1;
        };

        return userResource;
    }

})();
