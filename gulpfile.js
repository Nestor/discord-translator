const gulp = require('gulp');
const eslint = require('gulp-eslint');
const uglify = require('gulp-uglify-es').default;
const watch = require('gulp-watch');
const lec = require('gulp-line-ending-corrector');

gulp.task('lint', () => {
    return gulp.src(['src/**/*.js'])
        .pipe(lec())
        .pipe(eslint())
        .pipe(eslint.format())
        .pipe(eslint.failAfterError());
});

gulp.task("compress", function () {
    return gulp.src("src/**/*.js")
        .pipe(uglify())
        .pipe(gulp.dest("build/"));
});

gulp.task('default', ['lint', 'compress']);

gulp.task('build', ['lint', 'compress']);

gulp.task('watch', function() {
  gulp.watch('src/**/*.js', ['default']);
});
