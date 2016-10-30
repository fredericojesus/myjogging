(function () {
    'use strict';

    angular.module('app.header')
        .controller('EditUserController', EditUserController);

    /*@ngInject*/
    function EditUserController($rootScope, $scope, $mdDialog, toast, userShown, User, user) {
        $scope.user = angular.copy(user);
        var userFallback = angular.copy(user);            
        //prevent making duplicate calls
        var isSavingUser = false;

        //functions
        $scope.saveUser = saveUser;
        $scope.cancel = cancel;

        function saveUser() {
            isSavingUser = true;
            $scope.user.alias = $scope.user.username.toLowerCase();
            angular.extend(user, $scope.user);
            user.$update().then(processUpdatedUser, handleErrorSavingUser);
        }

        function cancel() {
            $mdDialog.cancel();
        }

        function processUpdatedUser(user) {
            $mdDialog.hide(user);
            isSavingUser = false;
        }

        function handleErrorSavingUser(err) {
            angular.extend(user, userFallback);
            var message = err.data.error ? err.data.error : 'Something went wrong when saving user. Please try again.';
            toast.showToast(message);
        }
    }
})();