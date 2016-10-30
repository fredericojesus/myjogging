(function () {
    'use strict';

    angular.module('app.main')
        .controller('FilterController', FilterController);

    /*@ngInject*/
    function FilterController($scope, $mdDialog, $stateParams, toast, authService) {
        $scope.filterType = 'Week';
        $scope.monday = undefined;
        $scope.maxDate = new Date();
        $scope.dateFrom = undefined;
        $scope.dateTo = new Date();
        $scope.isManager = $stateParams.username && authService.currentUser().username !== $stateParams.username ? true : false;

        //functions
        $scope.filterMeals = filterMeals;
        $scope.onlyMondaysPredicate = onlyMondaysPredicate;
        $scope.cancel = cancel;

        function filterMeals() {
            if (isFormValidated()) {
                //if filter type is date
                var dateFrom = $scope.dateFrom;
                var dateTo = $scope.dateTo;

                //if filter type is week
                if ($scope.filterType === 'Week') {
                    dateFrom = new Date($scope.monday);
                    dateTo = new Date($scope.monday);
                    dateTo.setDate(dateTo.getDate() + 6);
                }

                var filter = {
                    dateFrom: dateFrom,
                    dateTo: dateTo,
                    isDefaultFilter: false
                };

                $mdDialog.hide(filter);
            }
        }

        function onlyMondaysPredicate(date) {
            return date.getDay() === 1;
        }

        function cancel() {
            $mdDialog.cancel();
        }

        function isFormValidated() {
            var errorMessage;

            if (!$scope.monday && $scope.filterType === 'Week') {
                errorMessage = 'Please enter a monday';
            } else if (!$scope.dateFrom && $scope.filterType === 'Date') {
                errorMessage = 'Please enter date from';
            } else if (!$scope.dateTo && $scope.filterType === 'Date') {
                errorMessage = 'Please enter date to';
            }

            if (errorMessage) {
                toast.showToast(errorMessage);
                return false;
            }

            return true;
        }
    }

})();