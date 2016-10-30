(function () {
    'use strict';

    angular.module('app')
        .controller('AdminController', AdminController);

    /*@ngInject*/
    function AdminController($scope, $state, $mdDialog, authService, User, isAuthorized) {
        if (!isAuthorized) {
            return $state.go('main');
        }

        $scope.usersList = [];
        $scope.isAdmin = authService.currentUser().hasRole('admin');
        //originatorEv is used so that the close dialog animation animates towards button
        var originatorEv;

        //functions
        $scope.goToUser = goToUser;
        $scope.openMenu = openMenu;
        $scope.editUser = editUser;
        $scope.deleteUser = deleteUser;

        getUsers();

        function getUsers() {
            User.getUsers().$promise
                .then(function (users) {
                    $scope.usersList = users;
                });
        }

        function goToUser(username) {
            $state.go('user', { username: username }, { reload: true });
        }

        function openMenu($mdOpenMenu, ev) {
            originatorEv = ev;
            $mdOpenMenu(ev);
        }

        function editUser(user) {
            var dialogOptions = {
                controller: 'EditUserController',
                templateUrl: 'app/admin/edit-user/edit-user.html',
                parent: angular.element(document.body),
                targetEvent: originatorEv,
                clickOutsideToClose: true,
                locals: {
                    user: user
                }
            };

            $mdDialog.show(dialogOptions).then(function (user) {
            });
        }

        function deleteUser(index, user) {
            var confirm = $mdDialog.confirm()
                .title('Delete User')
                .textContent('Are you sure you want to delete this user?')
                .ariaLabel('Delete User')
                .targetEvent(originatorEv)
                .clickOutsideToClose(true)
                .ok('OK')
                .cancel('CANCEL');

            $mdDialog.show(confirm)
                .then(function () {
                    user.$delete();
                })
                .then(function () {
                    $scope.usersList.splice(index, 1);
                });
        }
    }
})();