const os = require('os');
const gulp = require('gulp');
const nodemon = require('gulp-nodemon');
const jshint = require('gulp-jshint');
const jasmineBrowser = require('gulp-jasmine-browser');
const coveralls = require('gulp-coveralls');
const browserSync = require('browser-sync').create();
const open = require('gulp-open');

// watch for css jade and js file changes and reload browser
gulp.task('watch', () => {
  'use strict';
  gulp.watch(['src/test/*.js', 'src/sass/*.scss', 'src/js/*.js'], browserSync.reload);
});

// run the nodemon server reload
gulp.task('nodemon', function (cb) {
  const started = false;
  return nodemon({
    script: 'app.js',
    ext: 'js', 
    env: { 'NODE_ENV': 'development' },
    ignore: 'src/*',
    tasks: ['browser-sync']
  }).on('start', function () {
    // to avoid nodemon being started multiple times
    // thanks @matthisk
    if (!started) {
      cb();
      started = true; 
    } 
  });
});
 
//gulp jshint code testing
gulp.task('lint', () => {
  'use strict';
  return gulp.src(['*.js', 'src/js/*.js', 'src/test/*.js'])
    .pipe(jshint()) 
    .pipe(jshint.reporter('default')); 
});

//re-run jasmine tests on file change
gulp.task('jasmine', ['lint'], () => {
  'use strict';
  return gulp.src(['src/js/inverted-index.js', 'src/test/inverted-index-test.js'])
    .pipe(jasmineBrowser.specRunner())
    .pipe(jasmineBrowser.server({port: 8888}));
}); 

// gulp coverall testing
gulp.task('coveralls', ['jasmine'], () => {
  'use strict';
  return gulp.src('src/spec/lcov.info')
    .pipe(coveralls());
});

// open jasmine test page in browser
gulp.task('jasmine-url', function(){
  var options = {
    uri: 'localhost:8888',
    app: 'firefox'
  };
  gulp.src(__filename) 
  .pipe(open(options));
});

// run browsersync after nodemon runs
gulp.task('browser-sync', () => {
  browserSync.init(null, {
    proxy: "http://localhost:3000",
    browser: 'firefox',
    port: 5000,
    ui: {
      port: 5001
    },
    open: "local",
    reloadOnRestart: true
  });
});
 
// run the default task
gulp.task('default', ['watch', 'nodemon', 'browser-sync']);