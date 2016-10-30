(function () {
    'use strict';

    angular
        .module('app.header')
        .controller('HeaderController', HeaderController);

    /*@ngInject*/
    function HeaderController($scope, $mdDialog, $state, authService) {
        $scope.authService = authService;
        //originatorEv is used so that the close dialog animation animates towards button
        var originatorEv;
        
        //functions
        $scope.openMenu = openMenu;
        $scope.logout = logout;

        function openMenu($mdOpenMenu, ev) {
            originatorEv = ev;
            $mdOpenMenu(ev);
        }

        function logout() {
            var confirm = $mdDialog.confirm()
                .title('Logout')
                .textContent('Are you sure you want to logout?')
                .ariaLabel('Logout')
                .targetEvent(originatorEv)
                .clickOutsideToClose(true)
                .ok('OK')
                .cancel('CANCEL');

            $mdDialog.show(confirm)
                .then(function () {
                    return authService.logout();
                })
                .then(function () {
                    $state.go('auth');
                });
        }
    }

})();