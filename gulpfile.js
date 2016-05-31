const gulp = require('gulp');
const webpack = require('webpack-stream');
const eslint = require('gulp-eslint');
const protractor = require('gulp-protractor').protractor;
const cp = require('child_process');

var children = [];
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

gulp.task('protractor:test', ['build:dev', 'startservers:test'], () => {
  gulp.src('test/e2e/*spec.js')
    .pipe(protractor( {
      configFile: 'test/e2e/config.js'
    }))
    .on('end', () => {
      children.forEach((child) => {
        child.kill('SIGTERM');
      });
    });
});

gulp.task('startservers:test', (done) => {
  children.push(cp.fork('server.js'));
  children.push(cp.spawn('webdriver-manager', ['start']));
  setTimeout(done, 1000);
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

gulp.task('test', ['protractor:test']);
gulp.task('build:dev', ['webpack:dev', 'static:dev']);
gulp.task('lint', ['lint:browser', 'lint:server']);
gulp.task('default', ['build:dev', 'lint', 'test']);
