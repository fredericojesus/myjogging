(function () {
    'use strict';

    angular
        .module('app.auth')
        .factory('userShown', userShown);

    /*@ngInject*/
    function userShown() {
        var _user = {};

        var service = {
            getUserShown: getUserShown,
            setUserShown: setUserShown
        };

        return service;

        function getUserShown() {
            return _user;
        }

        function setUserShown(userShown) {
            _user = userShown;
        }
    }

})();