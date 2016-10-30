(function() {
    'use strict';

    angular.module('app', [
        'app.auth',
        'app.header',
        'app.main',
        'app.admin',
        'app.utils',
        'ngMaterial',
        'ngMdIcons',
        'ui.router',
        'ngAnimate'
    ]);

    _.mixin(s.exports());

})();
