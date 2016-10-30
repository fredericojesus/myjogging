(function () {
    'use strict';

    angular.module('app.main')
        .controller('AddEditJogController', AddEditJogController);

    /*@ngInject*/
    function AddEditJogController($scope, $mdDialog, toast, Jog, userShown, jog) {
        //if jog exists, we will edit that jog
        $scope.title = jog ? 'Edit Jog' : 'Add Jog';
        $scope.addEditText = jog ? 'Save' : 'Add';
        $scope.distance = jog ? parseFloat(jog.distance) : '';
        $scope.hours = jog ? jog.getHours() : '';
        $scope.minutes = jog ? jog.getMinutes() : '';
        $scope.seconds = jog ? jog.getSeconds() : '';
        $scope.date = jog ? new Date(jog.date) : new Date();
        $scope.maxDate = new Date();
        //prevent creating duplicate jogs
        var isSavingJog = false;

        //functions
        $scope.addEditJog = addEditJog;
        $scope.cancel = cancel;

        function addEditJog() {
            if (isFormValidated() && !isSavingJog) {
                isSavingJog = true;

                var newJog = {};
                newJog.distance = $scope.distance;
                newJog.duration = ($scope.hours * 3600) + ($scope.minutes * 60) + $scope.seconds;
                //set hours to 12 to avoid problems with gmt +1 or -1
                newJog.date = $scope.date.setHours(12);

                //create
                if (!jog) {
                    Jog.save({
                        userId: userShown.getUserShown()._id
                    }, newJog).$promise.then(processSavedJog, handleErrorSavingJog);
                }
                //edit
                else {
                    var editedJog = new Jog();
                    newJog._id = jog._id;
                    angular.extend(editedJog, newJog);
                    editedJog.$update(newJog).then(processSavedJog, handleErrorSavingJog);
                }
            }
        }

        function cancel() {
            $mdDialog.cancel();
        }

        function processSavedJog(jog) {
            $mdDialog.hide(jog);
            isSavingJog = false;
        }

        function handleErrorSavingJog(err) {
            var message = 'Something went wrong when saving your jog. Please try again.';
            toast.showToast(message);
            isSavingJog = false;
        }


        /**
         * return {Boolean}
         */
        function isFormValidated() {
            var errorMessage;

            if (!$scope.distance) {
                errorMessage = 'Please enter how much km you have jogged';
            } else if (!$scope.hours && !$scope.minutes && !$scope.seconds) {
                errorMessage = 'Please enter how much time you have jogged';
            } else if ($scope.hours > 99) {
                errorMessage = 'Please enter a realistic number on hours';
            } else if ($scope.minutes > 59) {
                errorMessage = 'Please enter a valid number on minutes';
            } else if ($scope.seconds > 59) {
                errorMessage = 'Please enter a valid number on seconds';
            } else if (!$scope.date) {
                errorMessage = 'Please enter the day you have jogged';
            }

            if (errorMessage) {
                toast.showToast(errorMessage);
                return false;
            }

            return true;
        }
    }
})();