var gulp = require('gulp');
var nodemon = require('gulp-nodemon');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');

gulp.task('js', function() {
  gulp.src(['!public/javascripts/vendor/**/*.js', 'public/javascripts/**/app.js', 'public/javascripts/**/*.js'])
    .pipe(concat('/public/application.js'))
    .pipe(uglify())
    .pipe(gulp.dest('.'))
  gulp.src(['public/javascripts/vendor/**/*.js'])
    .pipe(concat('/public/vendor.js'))
    .pipe(uglify())
    .pipe(gulp.dest('.'))
})

gulp.task('css', function() {
  gulp.src(['public/stylesheets/**/imports.css', 'public/stylesheets/**/*.css'])
    .pipe(concat('/public/style.css'))
    .pipe(gulp.dest('.'))
})

gulp.task('merge', function() {
  gulp.start('js', 'css')
  nodemon({
    script: 'app.js',
    ext: 'js css',
    ignore: ['public/application.js', 'public/style.css', 'public/vendor.js'],
    tasks: ['js', 'css']
  })
})
