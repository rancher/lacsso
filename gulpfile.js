'use strict';

var gulp = require('gulp');
var git = require('gulp-git');
var bump = require('gulp-bump');
var filter = require('gulp-filter');
var release = require('gulp-github-release');
var path = require("path");
var exec = require('child_process').exec;
var cssPrefix = require('gulp-css-prefix');

gulp.task('build', build);
gulp.task('prefix', ['build'], prefix);
gulp.task('tag', ['build','prefix'], function() { return inc('patch'); })
gulp.task('tag-patch', function() { return inc('patch'); })
gulp.task('tag-minor', function() { return inc('minor'); })
gulp.task('tag-major', function() { return inc('major'); })
gulp.task('release', ['build','prefix','tag'], release);

function build(cb) {
  exec('./node_modules/.bin/ember build --environment=production', function(err) {
    cb(err);
  });
}

function prefix(cb) {
  return gulp.src('dist/assets/lacsso.css')
    .pipe(cssPrefix({elementClass: 'lacsso', prefix: 'lacsso.'}))
    .pipe(gulp.dest('.'));
}

function release(cb) {
  exec('npm publish', function(err) {
    cb(err);
  });
}

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
    .pipe(release({
      token: process.env.GITHUB_TOKEN,
      manifest: require('./package.json')
    }));
}
