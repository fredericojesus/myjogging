(function() {
    'use strict';

    angular
        .module('app.header')
        .directive('appHeader', appHeader);

    function appHeader() {
        return {
            restrict: 'E',
            templateUrl: 'app/header/header.html',
            controller: 'HeaderController'
        };
    }

})();