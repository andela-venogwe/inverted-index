const os = require('os');
const gulp = require('gulp');
const nodemon = require('gulp-nodemon');
const jshint = require('gulp-jshint');
const coveralls = require('gulp-coveralls');
const open = require('gulp-open');
const browserSync = require('browser-sync').create();
//process.env.NODE_ENV = process.env.NODE_ENV || 'development';

// we'd need a slight delay to reload browsers
// connected to browser-sync after restarting nodemon
const BROWSER_SYNC_RELOAD_DELAY = 2000;
 
//gulp jshint code testing
gulp.task('lint', () => {
  'use strict';
  return gulp.src(['*.js', './src/js/*.js', './src/jasmine/spec/*.js', './src/public/js/*.js'])
    .pipe(jshint()) 
    .pipe(jshint.reporter('default')); 
});

//re-run jasmine tests on file change
gulp.task('jasmine', ['lint'], () => {
  const browser = os.platform() === 'linux' ? 'google-chrome' : (
  os.platform() === 'darwin' ? 'google chrome' : (
  os.platform() === 'win32' ? 'chrome' : 'firefox'));

  gulp.src(['./src/js/*.js'])
  .pipe(open({
    uri: 'src/jasmine/SpecRunner.html',
    app: 'google-chrome'
  }))
  //.pipe(browserSync.reload({ stream: true }));
});

// gulp coverall['./src/js/*.js', './src/jasmine/spec/*.js'] testing
gulp.task('coveralls', ['jasmine'], () => {
  'use strict';
  return gulp.src('src/spec/coverage/**/lcov.info')
    .pipe(coveralls());
});

// run the nodemon server reload
gulp.task('nodemon', ['lint', 'coveralls', 'jasmine'], function (cb) {
  'use strict';
  let started = false;
  return nodemon({
    script: './bin/www',
    watch: ['app.js'],
    env: { 'NODE_ENV': 'development' }
  })
  .on('start', function () {
    //have nodemon run watch on start
    // to avoid nodemon being started multiple times
    // thanks @matthisk
    if (!started) {
      cb();
      started = true; 
    } 
  })
  .on('restart', function onRestart() {
    // reload connected browsers after a slight delay
    setTimeout(function reload() {
      browserSync.reload({
        stream: false
      });
    }, BROWSER_SYNC_RELOAD_DELAY);
  });
});

// run browsersync after nodemon runs
gulp.task('browser-sync', ['nodemon'], () => {
  browserSync.init(null, {
    proxy: "http://localhost:3000",
    files: ['./src/sass/*.scss', './src/js/*.js', './src/public/js/*.js'],
    browser: 'google chrome',
    reloadDelay: 2000,
    port: 4000,
    ui: {
      port: 4001
    }
  });
});

// run tasks on js files - @ TODO 
gulp.task('js',  function () {
  return gulp.src('src/public/**/*.js')
    // do stuff to JavaScript files
    //.pipe(uglify())
    //.pipe(gulp.dest('...'));
});

// reload browsers for css changes
gulp.task('css', function () {
  return gulp.src('src/public/**/*.css')
    .pipe(browserSync.reload({ stream: true }));
})


gulp.task('bs-reload', function () {
  browserSync.reload();
});

gulp.task('default', ['browser-sync'], function () {
  gulp.watch(['src/js/*.js', 'src/public/js/*.js'],   ['js', browserSync.reload]);
  gulp.watch('src/public/**/*.css',  ['css']);
  gulp.watch('src/views/*.jade', ['bs-reload']);
});  