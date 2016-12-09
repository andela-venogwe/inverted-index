'use strict';

const eslint = require('gulp-eslint');

const gulp = require('gulp');

const os = require('os');

const nodemon = require('gulp-nodemon');

const browserify = require('browserify');

const browserSync = require('browser-sync');


const browserSyncJasmine = browserSync.create('jasmine');

const browserSyncNode = browserSync.create('nodemon');

const nodejsPort = Math.floor((Math.random() * 1000) + 3000);

const browser = os.platform() === 'linux' ? 'google-chrome' : (
  os.platform() === 'darwin' ? 'google chrome' : (
  os.platform() === 'win32' ? 'chrome' : 'firefox')
);

// we'd need a slight delay to reload browsers
// connected to browser-sync after restarting nodemon
const BROWSER_SYNC_RELOAD_DELAY = 2000;

//gulp jshint code testing
gulp.task('lint', () => {
  return gulp.src(['./src/public/js/*.js','./src/jasmine/spec/*.js'])
    .pipe(eslint())
    .pipe(eslint.format());
});

// run the nodemon server reload
gulp.task('nodemon', (cb) => {
  let started = false;
  return nodemon({
    script: './bin/www',
    watch: ['app.js', 'gulpfile.js'],
    env: {'PORT': nodejsPort, 'NODE_ENV': 'development' }
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
      browserSyncNode.reload({
        stream: false
      });
      browserSyncJasmine.reload({
        stream: false
      });
    }, BROWSER_SYNC_RELOAD_DELAY);
  });
});

// run browsersync after nodemon runs
gulp.task('browser-sync', () => {
  browserSyncNode.init(null, {
    online: false,
    proxy: 'http://localhost:' + nodejsPort,
    browser: browser,
    port: 4000,
    ui: {
      port: 4001
    }
  });
});

// run browsersync for jasmine tests
gulp.task('browser-sync-jasmine', () => {
  browserSyncJasmine.init(null, {
    online: false,
    browser: browser,
    server: {
      baseDir: "./",
      index: "src/jasmine/SpecRunner.html"
    },
    port: 9000,
    ui: {
      port: 9001
    }
  });
});

// reload browsers
gulp.task('bs-reload', function () {
  browserSyncNode.reload();
});

// reload browsers for scss changes
gulp.task('css', () => {
  return gulp.src('src/public/css/*.css')
    .pipe(browserSyncNode.reload({ stream: true }));
});

// gulp default tasks
gulp.task('default', ['nodemon', 'browser-sync', 'browser-sync-jasmine'], () => {
  gulp.watch(['src/public/js/Inverted-index.js',
   'src/jasmine/spec/*.js', 'src/public/Invertd-Index-Utility.js'], 
   browserSyncJasmine.reload);
  gulp.watch(['src/sass/*.scss', 'src/public/**/*.css'], ['css']);
  gulp.watch(['src/views/*.jade', 'src/public/js/*.js'], ['bs-reload']);
});