(function () {
    'use strict';

    angular.module('app.info-header')
        .controller('InfoHeaderController', InfoHeaderController);

    /*@ngInject*/
    function InfoHeaderController($scope, $http, $stateParams, jogsCache, authService, userShown) {
        $scope.userShown = userShown.getUserShown();
        //show message User not found if isManager
        if (!$scope.userShown.username) {
            $scope.usernameParams = $stateParams.username;
        }

        $scope.isManager = $stateParams.username && authService.currentUser().username !== $stateParams.username ? true : false;
        $scope.overallDistance = 0;
        $scope.overallAvgSpeed = 0;
        $scope.isFilterApplied = false;
        $scope.dateFrom = '';
        $scope.dateTo = '';            
       
        //event that listens to any change related to jogs in order to change the report message: jogs fetched, new jog, deleted jog or filter applied
        $scope.$on('jogsChanges', function (ev, filter) {
            $scope.overallDistance = jogsCache.getOverallDistance();
            $scope.overallAvgSpeed = jogsCache.getOverallAvgSpeed();

            if (filter && !filter.isDefaultFilter) {
                $scope.isFilterApplied = true;
                $scope.dateFrom = getDate(filter.dateFrom);
                $scope.dateTo = getDate(filter.dateTo);
            } else {
                $scope.isFilterApplied = false;
            }
        });

        function getDate(date) {
            var months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
            var month = months[date.getMonth()];

            return date.getDate() + ' ' + month;
        }
    }
})();