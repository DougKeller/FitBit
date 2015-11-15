var gulp = require('gulp');
var nodemon = require('gulp-nodemon');
var concat = require('gulp-concat');
var gulpif = require('gulp-if');
var uglify = require('gulp-uglify');
var minifyCss = require('gulp-minify-css');
var args = require('yargs').argv;

gulp.task('js', function() {
  gulp.src(['!public/javascripts/vendor/**/*.js', 'public/javascripts/**/app.js', 'public/javascripts/**/*.js'])
    .pipe(concat('/public/application.js'))
    .pipe(gulpif(!args.dev, uglify()))
    .pipe(gulp.dest('.'))
  gulp.src(['public/javascripts/vendor/**/*.js'])
    .pipe(concat('/public/vendor.js'))
    .pipe(gulpif(!args.dev, uglify()))
    .pipe(gulp.dest('.'))
})

gulp.task('css', function() {
  gulp.src(['public/stylesheets/**/imports.css', 'public/stylesheets/**/*.css'])
    .pipe(concat('/public/style.css'))
    .pipe(gulpif(!args.dev, minifyCss()))
    .pipe(gulp.dest('.'))
})

gulp.task('dev', function() {
  args.dev = true
  gulp.start('js', 'css')
  nodemon({
    script: 'app.js',
    ext: 'js css',
    ignore: ['public/application.js', 'public/style.css', 'public/vendor.js'],
    tasks: ['js', 'css']
  })
})

gulp.task('build', function() {
  gulp.start('js', 'css')
})
