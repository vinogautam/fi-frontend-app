/*
====================================================
Agent Profile Theme Gulp Workflow
Version: 1.0
Written By: Neil Thomas 
Last Edied By: Neil Thomas
====================================================
*/


//Gulp Module Includes
// ===================

var gulp  = require('gulp'),
    util = require('gulp-util');
    jshint = require('gulp-jshint');
    compass = require('gulp-compass');
    concat = require('gulp-concat');
    uglify = require('gulp-uglify');
    plumber = require('gulp-plumber');
    //browserSync = require('browser-sync').create();

// Configuration
// =============

var config = {
    sassSourceDir : 'src/sass/**/*.scss',
    jsSourceDir : 'src/js/**/*.js',
    cssDir : 'public/css',
    jsDir : 'public/js',
    jsOutput : 'agent.theme.js',
    production: !!util.env.production
}

// Display Successful Gulp Start Log
// =================================

gulp.task('default', ['compass', 'js'], function() {
  return util.log('Gulp ran successfully.')
});

// Compass Compile
// ============

gulp.task('compass', function() {
    return gulp.src(config.sassSourceDir)
        .pipe(plumber({
          errorHandler: function (error) {
            console.log(error.message);
            this.emit('end');
        }}))
        .pipe(compass({
            config_file: 'config.rb',
            css: 'public/css',
            sass: 'src/sass'
        }))
        //.pipe(browserSync.stream());
});

// Compile JavaScript
// ==================

gulp.task('js', function() {
  return gulp.src(config.jsSourceDir)
        .pipe(plumber({
          errorHandler: function (error) {
            console.log(error.message);
            this.emit('end');
        }}))
        .pipe(jshint())
        .pipe(concat(config.jsOutput))
        .pipe(config.production ? uglify() : util.noop())
        .pipe(gulp.dest(config.jsDir))
       // .pipe(browserSync.stream())
});

gulp.task('browser-sync', function() {
   // browserSync.init({
      //  proxy: 'http://localhost/bricarindustries/public',
       // port: 8080,
       // open: false
   // });

    gulp.watch(config.sassSourceDir, ['compass']);
    gulp.watch(config.jsSourceDir, ['js-watch']);
   // gulp.watch('public/index.html').on('change', function() {
     //   browserSync.reload();
    //}); 
});





// Watch Tasks
// ===========

gulp.task('js-watch', ['js'], function() {
   // browserSync.reload();
});

gulp.task('sass-watch', ['compass'], function() {
   // browserSync.reload();
});

gulp.task('watch', ['browser-sync'], function() {
   return util.log('Watching for changes...');
});