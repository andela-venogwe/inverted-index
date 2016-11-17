const gulp        = require('gulp');
const browserSync = require('browser-sync').create();
const nodemon = require('gulp-nodemon');
const jshint = require('gulp-jshint');
const jasmineBrowser = require('gulp-jasmine-browser');
const coveralls = require('gulp-coveralls');

// watch for css jade and js file changes and reload browser
gulp.task('watch', () => {
  'use strict';
  gulp.watch(['src/*.js', 'src/sass/*.scss', 'public/javascripts/*.js'], browserSync.reload);
});

//gulp jshint code testing
gulp.task('lint', () => {
  'use strict';
  return gulp.src(['*.js', 'src/*.js'])
    .pipe(jshint())
    .pipe(jshint.reporter('default'));
});

//re-run jasmine tests on file change
gulp.task('jasmine', ['lint'], () => {
  'use strict';
  return gulp.src('jasmine/spec/*.js')
    .pipe(jasmineBrowser.specRunner())
    .pipe(jasmineBrowser.server({port: 8888}));
});

// gulp coverall testing
gulp.task('coveralls', ['jasmine'], () => {
  'use strict';
  return gulp.src('./jasmine/spec/lcov.info')
    .pipe(coveralls());
});

// run the default task
gulp.task('default', ['watch', 'browser-sync']);

// run browsersync after nodemon runs
gulp.task('browser-sync', function() {
  browserSync.init(null, {
    proxy: "http://localhost:3000",
    browser: "google chrome",
    port: 5000,
    ui: {
      port: 5001
    },
    reloadOnRestart: true
  });
});

// run the nodemon server reload
gulp.task('nodemon', function (cb) {
  const started = false;
  return nodemon({
    script: 'app.js',
    ext: 'js', 
    env: { 'NODE_ENV': 'development' }
  }).on('start', function () {
    // to avoid nodemon being started multiple times
    // thanks @matthisk
    if (!started) {
      cb();
      started = true; 
    } 
  });
});