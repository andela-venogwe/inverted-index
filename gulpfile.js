const gulp        = require('gulp');
const sass        = require('gulp-ruby-sass');
const browserSync = require('browser-sync').create();

// Static Server + watching scss/jade files
gulp.task('serve', ['sass', 'js'], () => {
  'use srict';
  browserSync.init({
    server: "./app"
  });

  gulp.watch("app/sass/*.scss", ['sass']);
  gulp.watch("app/views/*.jade").on('change', browserSync.reload);
});

// Compile sass into CSS & auto-inject into browsers
gulp.task('sass', () => {
  return gulp.src("app/scss/*.scss")
    .pipe(sass())
    .pipe(gulp.dest("app/css"))
    .pipe(browserSync.stream());
});

// process JS files and return the stream.
gulp.task('js', () => {
  return gulp.src('src/*js')
    .pipe(browserify())
    .pipe(uglify())
    .pipe(gulp.dest('dist/js'));
});

gulp.task('default', ['serve']);