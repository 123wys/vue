/**
 * Created by zhubc 20170221
 */
'use strict';
var gulp = require('gulp');
var sftp = require('gulp-sftp');

var nodeUser = {
  host: '192.168.70.250',
  user: 'node',
  pass: 'node@123',
  remotePath: '/home/node/iweb/public/dist/',
  timeout: 60 * 1000,
}
var ali1 = {
  host: '101.37.84.103',
  user: 'saas',
  pass: 'saas@2017031E',
  remotePath: '/app/saas/dist/',
  timeout: 60 * 1000,
}
var ali2 = {
  host: '114.55.253.219',
  user: 'saas',
  pass: 'saas@2017031E',
  remotePath: '/app/saas/dist/',
  timeout: 60 * 1000,
}
var demo = {
  host: '116.62.44.224',
  user: 'saas',
  pass: 'saas@demo',
  remotePath: '/data/saas/dist/',
  timeout: 60 * 1000,
}
gulp.task('uploadTest', function() {
  return gulp.src('dist/**').pipe(sftp(nodeUser));
});
gulp.task('uploadProduct', function() {
  return gulp.src('dist/**').pipe(sftp(ali1)).pipe(sftp(ali2));
});
gulp.task('uploadDemo', function() {
  return gulp.src('dist/**').pipe(sftp(demo));
});
gulp.task('uploadAll', function() {
  return gulp.src('dist/**').pipe(sftp(nodeUser)).pipe(sftp(ali1)).pipe(sftp(ali2)).pipe(sftp(demo));
});

