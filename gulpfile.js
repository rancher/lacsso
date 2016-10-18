'use strict';

var fs = require('fs');
var gulp = require('gulp');
var git = require('gulp-git');
var bump = require('gulp-bump');
var filter = require('gulp-filter');
var release = require('gulp-github-release');
var exec = require('child_process').exec;
var cssPrefix = require('gulp-css-prefix');


gulp.task('build', function(cb) {
  exec('./node_modules/.bin/ember build --environment=production', function(err) {
    cb(err);
  });
});

gulp.task('bump', ['build'], function() {
  return gulp.src(['./package.json'])
    // bump the version number in those files
    .pipe(bump({type: 'patch'}))
    // save it back to filesystem
    .pipe(gulp.dest('./'));
});

gulp.task('prefix', ['bump'], function() {
  return gulp.src('dist/assets/lacsso.css')
    .pipe(cssPrefix({elementClass: 'lacsso', prefix: 'lacsso.'}))
    .pipe(gulp.dest('.'));
});

gulp.task('commit', ['prefix'], function() {
  return gulp.src('.')
    .pipe(git.add())
    .pipe(git.commit('Bump version'));
});

gulp.task('push', ['commit'], function(cb) {
  git.push('origin','master',cb);
});

gulp.task('tag', ['push'], function(cb) {
  git.tag(getVersion(), getVersion(), function(err) {
    if (err) {
      return cb(err);
    }

    git.push('origin','master', {args: '--tags'}, cb);
  });
});

gulp.task('publish-npm', ['tag'], function(cb) {
  exec('npm publish', function(err) {
    cb(err);
  });
});

gulp.task('release', ['publish-npm'], function() {
  return gulp.src('./lacsso.css')
    .pipe(release({
      token: process.env.GITHUB_TOKEN,
      tag: getVersion(),
      manifest: require('./package.json')
    }));
});

function getVersion () {
  return JSON.parse(fs.readFileSync('./package.json', 'utf8')).version;
};
