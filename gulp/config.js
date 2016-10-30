'use strict';

module.exports = function () {
    var client = './client/';
    var server = './server/';
    var clientApp = client + 'app/';
    var dist = './dist/';
    var temp = './.tmp/';

    var config = {

        //Files paths
        alljs: [
            './client/**/*.js',
            './*.js',
            './gulp/**/*.js'
        ],
        client: client,
        css: temp + '**/*.css',
        dist: dist,
        htmltemplates: clientApp + '**/*.html',
        index: 'index.html',
        images: client + 'images/**/*.*',
        js: [
            clientApp + '**/*.module.js',
            clientApp + '**/*.js',
            temp + '*.js',
            '!' + clientApp + '**/*.spec.js'
        ],
        root: './',
        server: server,
        stylus: client + 'styles/*.styl',
        temp: temp,

        //files to watch
        watchFiles: [
            clientApp + '**/*.js',
            clientApp + '**/*.html',
            client + 'styles/*.styl',
        ],

        //optimized files
        optimized: {
            app: 'app.js',
            lib: 'lib.js'
        },

        //template cache
        templateCache: {
            file: 'templates.js',
            options: {
                module: 'app',
                root: 'app/',
                standAlone: false
            }
        },

        //replace svg path
        appConfigJs: clientApp + 'app.config.js',

        //bower and npm locations
        bower: {
            json: require('../bower.json'),
            directory: './bower_components/',
            ignorePath: '../..'
        },
        
        //browser sync
        browserReloadDelay: 0, //1500

        //Node settings
        nodeServer: server + 'app.js',
        defaultPort: '8080'
    };

    config.getWiredepDefaultOptions = function () {
        var options = {
            bowerJson: config.bower.json,
            directory: config.bower.directory,
            ignorePath: config.bower.ignorePath
        };
        return options;
    };

    return config;
};
