'use strict';

var gulp = require('gulp');
var config = require('../config')();
var log = require('../util/log');
var del = require('del');

var $ = require('gulp-load-plugins')({lazy: true});

/**
 * Remove all files from the dist and temp folders
 * @param {Function} done - callback when complete
 */
gulp.task('clean', function(done) {
    var delconfig = [].concat(config.dist, config.temp);
    log.message('Cleaning: ' + $.util.colors.blue(delconfig));
    del(delconfig).then(function() {
        done();
    });
});

/**
 * Remove all js from the temp and dist folders
 * @param  {Function} done - callback when complete
 */
gulp.task('clean-code', function(done) {
    var files = [].concat(
        config.temp + '**/*.js',
        config.dist + 'js/**/*.js',
        config.dist + '**/*.html'
    );
    clean(files, done);
});

/**
 * Remove all styles from the temp and dist folders
 * @param {Function} done - callback when complete
 */
gulp.task('clean-styles', function(done) {
    var files = [].concat(
        config.temp + '**/*.css',
        config.dist + 'styles/**/*.css'
    );
    clean(files, done);
});

/**
 * Remove all images from the dist folder
 * @param {Function} done - callback when complete
 */
gulp.task('clean-images', function(done) {
    clean(config.dist + 'images/**/*.*', done);
});

/**
 * Delete all files in a given path
 * @param {Array} path - array of paths to delete
 * @param {Function} done - callback when complete
 */
function clean(path, done) {
    log.message('Cleaning: ' + $.util.colors.blue(path));
    del(path).then(function() {
        done();
    });
}
