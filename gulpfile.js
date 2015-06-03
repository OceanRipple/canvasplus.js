var gulp = require('gulp');


var jshint = require('gulp-jshint');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');

gulp.task('lint', function() {
    gulp.src('./src/*.js')
        .pipe(jshint())
        .pipe(jshint.reporter('default'));
});

gulp.task('scripts', function() {
    gulp.src('./src/*.js')
        .pipe(concat('canvasplus.js'))
        .pipe(gulp.dest('./des'))
        .pipe(rename('canvasplus.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest('./des'));
});

gulp.task('default',['lint','scripts'], function(){
    gulp.watch('./src/*.js', function(){
        gulp.run('lint','scripts');
    });
});
