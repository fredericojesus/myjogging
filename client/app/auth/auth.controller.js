(function () {
    'use strict';

    angular
        .module('app.auth')
        .controller('AuthController', AuthController);

    /*@ngInject*/
    function AuthController($scope, $state, authService, toast) {
        $scope.username = '';
        $scope.password = '';
        
        $scope.login = function () {
            authService.authenticateUser($scope.username, $scope.password)
                .then(authSuccess)
                .catch(authError);
        };

        $scope.signup = function () {                  
            authService.signupUser($scope.username, $scope.password)
                .then(authSuccess)
                .catch(authError);
        };

        function authSuccess() {
            $state.go('main');
        }

        function authError(err) {
            if (err) {
                toast.showToast(err);
            }
        }
    }

})();
