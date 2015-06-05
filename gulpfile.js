var gulp = require('gulp');


var jshint = require('gulp-jshint');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var stylish = require('jshint-stylish'); 
var cache  = require('gulp-cached');

gulp.task('lint', function() {
    gulp.src('./src/*.js')
        .pipe(cache('jshint'))
        .pipe(jshint('.jshintrc'))
        .pipe(jshint.reporter(stylish,{
            verbose:true
        }));
});

gulp.task('scripts', function() {
    gulp.src(['./src/canvasplus.js','./src/*.js'])
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
