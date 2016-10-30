(function() {
    'use strict';

    angular
        .module('app.info-header')
        .directive('infoHeader', infoHeader);

    function infoHeader() {
        return {
            restrict: 'E',
            templateUrl: 'app/main/info-header/info-header.html',
            controller: 'InfoHeaderController'
        };
    }

})();