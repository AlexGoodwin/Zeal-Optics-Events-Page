/*jslint node:true */

'use strict';

var gulp = require('gulp'),
    sass = require('gulp-sass'),
    autoprefixer = require('gulp-autoprefixer'),
    minify = require('gulp-minify'),
    browserSync = require('browser-sync').create(),
    input = './css/**/*.scss',
    output = './css';

gulp.task('default', function() {
    gulp.start('compressJs');
    gulp.start('css');
});

gulp.task('browserSync', function() {
    browserSync.init({
        server: {
            baseDir: './'
        },
    });
});

gulp.task('compressJs', function() {
    gulp.src('./js/**/*.js')
        .pipe(minify({
            ext: {
                min: '.min.js'
            }
        }))
        .pipe(gulp.dest('./js'));
});

gulp.task('css', function() {
    return gulp.src(input)
        .pipe(sass({
            outputStyle: 'compressed'
        }).on('error', sass.logError))
        .pipe(autoprefixer({
            browsers: ['last 3 versions']
        }))
        .pipe(gulp.dest(output))
        .pipe(browserSync.reload({
            stream: true
        }));
});

gulp.task('watch', ['browserSync', 'css'], function() {
    gulp.watch(input, ['css']);
    // gulp.watch(['./js/**/*.js', '!*.min.js'], ['compressJs']);
});
