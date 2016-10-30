(function() {
    'use strict';

    angular
        .module('app.jogs')
        .directive('jog', jog);

    function jog() {
        return {
            restrict: 'E',
            templateUrl: 'app/main/jogs/jog.html'
        };
    }

})();