'use strict';
 
var gulp = require('gulp');
var sass = require('gulp-sass');
var path = require("path");
 
gulp.task('sass', function () {
  return gulp.src('./lacsso.scss')
    .pipe(sass({ includePaths: ['./**'] }))
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('./'));
});

gulp.task('sass:watch', function () {
  gulp.watch('./**/*.scss', ['sass']);
});
