(function () {
    'use strict';

    angular.module('app.jogs')
        .factory('Jog', jog);

    /*@ngInject*/
    function jog($resource) {
        var baseUrl = '/api/jogs';
        var jogResource = $resource(baseUrl + '/:_id', { _id: '@_id' }, {
            update: { method: 'PUT', isArray: false },
        });

        jogResource.prototype.getDate = getDate;
        jogResource.prototype.getDuration = getDuration;
        jogResource.prototype.getAvgSpeed = getAvgSpeed;
        jogResource.prototype.getHours = getHours;
        jogResource.prototype.getMinutes = getMinutes;
        jogResource.prototype.getSeconds = getSeconds;

        return jogResource;

        function getDate() {
            /*jshint validthis:true */
            var date = new Date(this.date);
            var months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
            var month = months[date.getMonth()];

            return date.getDate() + ' ' + month + ', ' + date.getFullYear();
        }

        function getDuration() {
            /*jshint validthis:true */
            var hours = this.getHours() > 9 ? this.getHours() : '0' + this.getHours();
            var minutes = this.getMinutes() > 9 ? this.getMinutes() : '0' + this.getMinutes();
            var seconds = this.getSeconds() > 9 ? this.getSeconds() : '0' + this.getSeconds();

            return hours + ':' + minutes + ':' + seconds;
        }

        function getAvgSpeed() {
            //+ converts a string to a float
            /*jshint validthis:true */
            return +(this.distance / ((this.duration / 3600) % 24)).toFixed(1);
        }

        function getHours() {
            /*jshint validthis:true */
            return parseInt(this.duration / 3600) % 24;
        }

        function getMinutes() {
            /*jshint validthis:true */
            return parseInt(this.duration / 60) % 60;
        }
        
        function getSeconds() {
            /*jshint validthis:true */
            return this.duration % 60;
        }
    }
})();