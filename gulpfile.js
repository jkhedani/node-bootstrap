var gulp        = require('gulp');
var plumber     = require('gulp-plumber');
var concat      = require('gulp-concat');
var rename      = require('gulp-rename');
var nodemon     = require('gulp-nodemon');
var livereload  = require('gulp-livereload');
var less        = require('gulp-less');
var sourcemaps  = require('gulp-sourcemaps');
var minifycss   = require('gulp-minify-css');
var lesssrc     = './public/src/less/**';
var lessdest    = './public/dist/stylesheets/';

var gutil = require('gulp-util');
var sourcemaps = require('gulp-sourcemaps');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var watchify = require('watchify');
var browserify = require('browserify');
var assign = require('lodash.assign');

/**
* Develop
*/
gulp.task('develop', function() {
    nodemon({
        script: './bin/www',
        env: { 'NODE_ENV': 'development' },
        nodeArgs: ['--debug'],
    });
});

/**
* Less
*/
gulp.task('less', function() {
    gulp.src( lesssrc )
    .pipe(plumber())
    //.pipe(sourcemaps.init({loadMaps: true}))
    //.pipe(concat('all.less'))
    .pipe(less())
    .pipe(minifycss())
    .pipe(rename({ suffix: '.min' }))
    .pipe(sourcemaps.write('maps'))
    .pipe(gulp.dest( lessdest ));
});

/**
* Browserify
*/
// https://github.com/gulpjs/gulp/tree/master/docs/recipes
// add custom browserify options here
var customOpts = {
    entries: ['./public/src/javascripts/scripts.js'],
    debug: true
};
var opts = assign({}, watchify.args, customOpts);
var b = watchify(browserify(opts));

gulp.task('js', bundle); // so you can run `gulp js` to build the file
b.on('update', bundle); // on any dep update, runs the bundler
b.on('log', gutil.log); // output build logs to terminal

function bundle() {
    return b.bundle()
    // log errors if they happen
    .on('error', gutil.log.bind(gutil, 'Browserify Error'))
    .pipe(source('bundle.js'))
    // optional, remove if you don't need to buffer file contents
    .pipe(buffer())
    // optional, remove if you dont want sourcemaps
    .pipe(sourcemaps.init({loadMaps: true})) // loads map from browserify file
    // Add transformation tasks to the pipeline here.
    .pipe(sourcemaps.write('./')) // writes .map file
    .pipe(gulp.dest('./public/dist/javascripts'));
}

/**
* Watch
*/
gulp.task('watch', function() {
    livereload.listen();
    gulp.watch( lesssrc,  ['less']);
    gulp.watch( './public/src/javascripts/scripts.js', ['js']);
    gulp.watch( './public/src/less/**' ).on('change', livereload.changed); // Live reload for less
    gulp.watch( './views/**' ).on('change', livereload.changed);   // Live reload for view templates
});

gulp.task('default', [ 'watch', 'develop', 'less', 'js' ]);
