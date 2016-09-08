'use strict';

var gulp = require('gulp');
var git = require('gulp-git');
var bump = require('gulp-bump');
var filter = require('gulp-filter');
var release = require('gulp-github-release');
var path = require("path");

gulp.task('release',       function() { return inc('patch'); })
gulp.task('release-patch', function() { return inc('patch'); })
gulp.task('release-minor', function() { return inc('minor'); })
gulp.task('release-major', function() { return inc('major'); })

function inc(importance) {
  // get all the files to bump version in
  return gulp.src(['./package.json'])
    // bump the version number in those files
    .pipe(bump({type: importance}))
    // save it back to filesystem
    .pipe(gulp.dest('./'))
    // commit the changed version number
    .pipe(git.commit('Bump release'))
    // read only one file to get the version number
    .pipe(filter('package.json'))
    // publish the release
    .pipe(gulp.src('./dist/assets/lacsso.css'))
    .pipe(release({
      token: process.env.GITHUB_TOKEN,
      manifest: require('./package.json')
    }))
}
