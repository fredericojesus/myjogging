(function () {
    'use strict';

    angular.module('app.jogs')
        .factory('jogsCache', jogsCache);

    /*@ngInject*/
    function jogsCache($q, $interval, Jog, userShown) {
        var _jogsList = [];
        var _overallDistance = 0;
        var _overallDuration = 0;
        var _overallAvgSpeed = 0;

        var service = {
            getJogs: getJogs,
            getOverallDistance: getOverallDistance,
            getOverallAvgSpeed: getOverallAvgSpeed,
            addJog: addJog,
            editJog: editJog,
            deleteJog: deleteJog,
            resetCache: resetCache
        };

        return service;

        /**
         * @param {Date} dateFrom
         * @param {Date} dateTo
         * @return {Promise}
         */
        function getJogs(dateFrom, dateTo) {
            var dfd = $q.defer();

            resetCache();
            
            Jog.query({
                userId: userShown.getUserShown()._id,
                dateFrom: dateFrom,
                dateTo: dateTo
            }).$promise.then(function (jogs) {
                _jogsList = jogs;
                _setOverallDistanceAndAvgSpeed();
                dfd.resolve(jogs);
            });

            return dfd.promise;
        }

        function getOverallDistance() {
            return _overallDistance;
        }

        function getOverallAvgSpeed() {
            return _overallAvgSpeed;
        }

        function addJog(jog) {
            _jogsList.unshift(jog);
            _overallDistance += jog.distance;
            _overallDuration += jog.duration;
            _setOverallAvgSpeed();
        }

        function editJog(index, editedJog) {
            _overallDistance -= _jogsList[index].distance;
            _overallDistance += editedJog.distance;
            _overallDuration -= _jogsList[index].duration;
            _overallDuration += editedJog.duration;
            _jogsList[index] = editedJog;
            _setOverallAvgSpeed();
        }

        function deleteJog(index, jog) {
            _jogsList.splice(index, 1);
            _overallDistance -= jog.distance;
            _overallDuration -= jog.duration;
            _setOverallAvgSpeed();
        }

        function resetCache() {
            _jogsList = [];
            _overallDistance = 0;
            _overallDuration = 0;
            _overallAvgSpeed = 0;
        }

        function _setOverallDistanceAndAvgSpeed() {
            for (var i = 0, len = _jogsList.length; i < len; i++) {
                _overallDistance += _jogsList[i].distance;
                _overallDuration += _jogsList[i].duration;
            }

            if (_jogsList.length) {
                _setOverallAvgSpeed();
            }
        }

        function _setOverallAvgSpeed() {
            _overallAvgSpeed = +(_overallDistance / ((_overallDuration / 3600) % 24)).toFixed(1);
        }
    }
})();