const gulp = require('gulp');
const webpack = require('webpack-stream');
const eslint = require('gulp-eslint');
const files = ['**/*.js', '!build/**', '!node_modules/**', '!test/**'];

gulp.task('webpack:dev', () => {
  gulp.src('app/js/entry.js')
    .pipe(webpack( {
      devtool: 'source-map',
      output: {
        filename: 'bundle.js'
      }
    }))
    .pipe(gulp.dest('./build'));
});

gulp.task('static:dev', () => {
  gulp.src(['app/**/*.html', 'app/**/*.css'])
    .pipe(gulp.dest('./build'));
});

gulp.task('lint:browser', () => {
  gulp.src('app/**/*.js')
    .pipe(eslint())
    .pipe(eslint.format());
});

gulp.task('lint:server', () => {
  gulp.src(files)
    .pipe(eslint())
    .pipe(eslint.format());
});

gulp.task('build:dev', ['webpack:dev', 'static:dev']);
gulp.task('default', ['build:dev', 'lint']);
gulp.task('lint', ['lint:browser', 'lint:server']);
