(function () {
    'use strict';

    angular.module('app')
        .controller('MainController', MainController);

    /*@ngInject*/
    function MainController($rootScope, $scope, $state, $stateParams, $mdDialog, Jog, jogsCache, authService, userShown, toast, isAuthorized) {
        if (!isAuthorized) {
            return $state.go('main');
        }

        $scope.delayTooltip = 500;
        $scope.jogsList = [];
        var activeFilter = {};
        $scope.isManager = $stateParams.username && authService.currentUser().alias !== $stateParams.username.toLowerCase() ? true : false;
        $scope.userNotFound = !userShown.getUserShown().username ? true : false;
        if ($scope.userNotFound) {
            return;
        }
        //originatorEv is used so that the close dialog animation animates towards button (for jog options)
        var originatorEv;

        //functions
        $scope.addEditJog = addEditJog;
        $scope.deleteJog = deleteJog;
        $scope.openJogOptions = openJogOptions;
        $scope.filterJogs = filterJogs;
        $scope.cancelFilter = cancelFilter;

        init();

        function init() {
            var dateTo = new Date();
            dateTo.setHours(23);
            dateTo.setMinutes(59);
            var dateFrom = new Date();
            dateFrom.setHours(5);
            //if it's sunday (0) get jogs from last 6 days
            dateFrom.setDate(dateFrom.getDate() + 1 - (dateFrom.getDay() === 0 ? 7 : dateFrom.getDay()));

            var filter = {
                dateFrom: dateFrom,
                dateTo: dateTo,
                isDefaultFilter: true
            };

            getJogs(filter);
        }

        /**
         * @param {Object} filter
         * @param {Date} filter.dateFrom
         * @param {Date} filter.dateTo
         */
        function getJogs(filter) {
            jogsCache.getJogs(filter.dateFrom, filter.dateTo).then(function (jogs) {
                $scope.jogsList = jogs;
                activeFilter = filter;
                //warn info-header that jogs have already been fetched
                $rootScope.$broadcast('jogsChanges', filter);
            });
        }

        /**
         * @param {Event} ev
         * @param {Number} index - when editing index is needed to update jog
         * @param {Object} jog - when edited the object jog is used to pass to the AddEditJogController controller
         */
        function addEditJog(ev, index, jog) {
            var dialogOptions = {
                controller: 'AddEditJogController',
                templateUrl: 'app/main/add-edit-jog/add-edit-jog.html',
                parent: angular.element(document.body),
                targetEvent: ev,
                clickOutsideToClose: true,
                locals: {
                    jog: jog
                }
            };

            $mdDialog.show(dialogOptions).then(function (newEditedJog) {
                //created
                if (!jog) {
                    newJogHandler(newEditedJog);
                }
                //edited
                else {
                    jogsCache.editJog(index, newEditedJog);
                    //warn info-header that a jog has been edited
                    $rootScope.$broadcast('jogsChanges', activeFilter);
                }
            });
        }

        /**
         * @param {Object} newJog
         */
        function newJogHandler(newJog) {
            var jog = new Jog();
            angular.extend(jog, newJog);

            toast.showToast('Your jog has been added successfully.');

            //if jog is between filter dates add it to cache and update info-header
            var jogDate = new Date(jog.date);
            if (jogDate.getDate() >= activeFilter.dateFrom.getDate() && jogDate.getDate() <= activeFilter.dateTo.getDate()) {
                jogsCache.addJog(jog);
                //warn info-header there's a new jog
                $rootScope.$broadcast('jogsChanges', activeFilter);
            }
        }

        /**
         * @param {Event} ev
         * @param {Number} index
         * @param {Object} jog
         */
        function deleteJog(ev, index, jog) {
            var confirm = $mdDialog.confirm()
                .title('Delete Jog')
                .textContent('Are you sure you want to delete this jog?')
                .ariaLabel('Delete Jog')
                .targetEvent(ev)
                .clickOutsideToClose(true)
                .ok('OK')
                .cancel('CANCEL');

            $mdDialog.show(confirm)
                .then(function () {
                    return jog.$delete();
                })
                .then(function () {
                    jogsCache.deleteJog(index, jog);
                    //warn info-header that a jog has been deleted
                    $rootScope.$broadcast('jogsChanges', activeFilter);
                });
        }

        function openJogOptions($mdOpenMenu, ev) {
            originatorEv = ev;
            $mdOpenMenu(ev);
        }

        function filterJogs(ev) {
            var dialogOptions = {
                controller: 'FilterController',
                templateUrl: 'app/main/filter/filter.html',
                parent: angular.element(document.body),
                targetEvent: ev,
                clickOutsideToClose: true,
            };

            $mdDialog.show(dialogOptions).then(function (filter) {
                getJogs(filter);
            });
        }

        function cancelFilter() {
            init();
        }
    }
})();