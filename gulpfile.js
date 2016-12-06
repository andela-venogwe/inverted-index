'use strict';

const browserify = require('browserify');

const sourcemaps = require('gulp-sourcemaps');

const source = require('vinyl-source-stream');

const buffer = require('vinyl-buffer');

const watchify = require('watchify');

const babel = require('babelify');

const browserSync = require('browser-sync');

const browserSyncJasmine = browserSync.create('jasmine');

const browserSyncNode = browserSync.create('nodemon');

const coveralls = require('gulp-coveralls');

const eslint = require('gulp-eslint');

const gulp = require('gulp');

const istanbul = require('gulp-istanbul');

const jasmine = require('gulp-jasmine');

const cover = require('gulp-coverage');

const nodemon = require('gulp-nodemon');

const os = require('os');

const plumber = require('gulp-plumber');

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
  return gulp.src(['./src/js/Inverted-index.js', './src/js/Utils.js', './src/js/app.js'])
    .pipe(eslint())
    .pipe(eslint.format());
});


gulp.task('jasmine', () => {
  return gulp.src('src/jasmine/js/spec.js')
    .pipe(jasmine())
    .pipe(istanbul())
    .pipe(istanbul.hookRequire())
    .pipe(istanbul.writeReports({
      reporters: [ 'lcov' ],
    }))
    .on('end', function(){
      gulp.src('/coverage/lcov.info')
      .pipe(coveralls());
    })
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
gulp.task('browser-sync', ['watch'], () => {
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
gulp.task('browser-sync-jasmine', ['watchSpec'], () => {
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

function compile(watch) {
  const bundler = watchify(browserify('./src/js/app.js', { debug: false }).transform(babel, {presets: ["es2015"]}));
  function rebundle() {
  return bundler
    .bundle()
    .on('error', function (err) {
        console.error(err);
        this.emit('end');
    })
    .pipe(source('build.js'))
    .pipe(buffer())
    .pipe(sourcemaps.init({loadMaps: true}))
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest('./src/public/js/'));
  }

  if (watch) {
  bundler.on('update', function () {
    console.log('-> bundling...');
    rebundle();
  });
  rebundle()
  } else {
  rebundle().pipe(exit());
  }
}

function watch() {
  return compile(true);
}

gulp.task('build', function() { return compile(); });
gulp.task('watch', function() { return watch(); });

// second babelify
function compileAgain(watching) {
  const bundler = watchify(browserify('./src/jasmine/spec/inverted-index-test.js', { debug: false }).transform(babel, {presets: ["es2015"]}));
  function rebundle() {
  return bundler
    .bundle()
    .on('error', function (err) {
        console.error(err);
        this.emit('end');
    })
    .pipe(source('spec.js'))
    .pipe(buffer())
    .pipe(sourcemaps.init({loadMaps: true}))
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest('./src/jasmine/js/'));
  }

  if (watching) {
  bundler.on('update', function () {
    console.log('-> bundling specs...');
    rebundle();
  });
  rebundle()
  } else {
  rebundle().pipe(exit());
  }
}

function watching() {
  return compileAgain(true);
}

gulp.task('buildSpec', function() { return compileAgain(); });
gulp.task('watchSpec', function() { return watching(); });

// gulp default tasks
gulp.task('default', ['nodemon', 'browser-sync', 'browser-sync-jasmine'], () => {
  gulp.watch(['src/jasmine/*.js', 'src/jasmine/spec/*.js'], browserSyncJasmine.reload);
  gulp.watch(['src/sass/*.scss', 'src/public/**/*.css'], ['css']);
  gulp.watch(['src/views/*.jade', 'src/public/js/*.js'], ['bs-reload']);
});
