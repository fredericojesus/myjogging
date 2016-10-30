'use strict';

var gulp = require('gulp');
var config = require('../config')();
var log = require('../util/log');
var browserSync = require('browser-sync');

var $ = require('gulp-load-plugins')({lazy: true});

/**
 * Compile stylus to css
 * @return {Stream}
 */
gulp.task('styles', ['clean-styles'], function() {
    log.message('Compiling Stylus --> CSS');

    return gulp
        .src(config.stylus)
        .pipe($.plumber())
        .pipe($.stylus())
        .pipe($.autoprefixer({
            browsers: ['last 2 version', '> 3%']
        }))
        .pipe($.concat('style.css'))
        .pipe(gulp.dest(config.temp));
});
