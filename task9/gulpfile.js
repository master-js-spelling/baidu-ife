var del = require('del');
var gulp = require('gulp');
var sass = require('gulp-sass');
var gutil = require('gulp-util');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var watchPath = require('gulp-watch-path');
var combiner = require('stream-combiner2');
var minifycss = require('gulp-minify-css');
var sourcemaps = require('gulp-sourcemaps');
var autoprefixer = require('gulp-autoprefixer');
var browserSync = require('browser-sync').create();
// var cached = require('gulp-cached');
// var remember = require('gulp-remember');
// var concat = require('gulp-concat');
var imagemin = require('gulp-imagemin');


// npm install --save-dev gulp del gulp-util gulp-uglify gulp-rename stream-combiner2 gulp-minify-css gulp-autoprefixer gulp-sass gulp-watch-path gulp-sourcemaps browser-sync

var handleError = function (err) {
    var colors = gutil.colors;
    console.log('\n');
    gutil.log(colors.red('Error!'));
    gutil.log('fileName: ' + colors.red(err.fileName));
    gutil.log('lineNumber: ' + colors.red(err.lineNumber));
    gutil.log('message: ' + err.message);
    gutil.log('plugin: ' + colors.yellow(err.plugin));
};

gulp.task('watchjs', function () {
    gulp.watch('src/js/**/*.js', function (event) {
        var paths = watchPath(event, 'src/', 'dist/');
        /*
        paths
            { srcPath: 'src/js/log.js',
              srcDir: 'src/js/',
              distPath: 'dist/js/log.js',
              distDir: 'dist/js/',
              srcFilename: 'log.js',
              distFilename: 'log.js' }
        */
        gutil.log(gutil.colors.green(event.type) + ' ' + paths.srcPath);
        gutil.log('Dist ' + paths.distPath);

        if (event.type === 'deleted') {
            var oldName = paths.distPath,
                newName = (function (name) {
                    var tmpName = name.split('.').slice(0, -1);
                    tmpName.push('min.js');
                    return tmpName.join('.');
                })(oldName),
                oldMap = oldName + '.map',
                newMap = newName + '.map';

            del([oldName, newName, oldMap, newMap]);                        // gulp-del 的删除 api
            // delete cached.caches.scripts[event.path];       // gulp-cached 的删除 api
            // remember.forget('scripts', event.path);         // gulp-remember 的删除 api
        } else {
            var combined = combiner.obj([
                gulp.src(paths.srcPath),
                // cached('scripts'),
                // jshint(),
                // remember('scripts'),
                // concat('app.js'),
                sourcemaps.init(),
                uglify(),
                rename({ extname: '.min.js' }),
                sourcemaps.write('./'),
                gulp.dest(paths.distDir)
            ]);

            combined.on('error', handleError);
        }

        browserSync.reload();
    });
});

gulp.task('js', function () {

    var combined = combiner.obj([
        gulp.src('src/js/**/*.js'),
        sourcemaps.init(),
        // concat('app.js'),
        uglify(),
        rename({ extname: '.min.js' }),
        // rename(function(path){console.log(path);return path;}),
        sourcemaps.write(),
        gulp.dest('dist/js/')
    ]);
    combined.on('error', handleError);
});

gulp.task('watchsass', function () {
    gulp.watch('src/sass/**/*.scss', function (event) {
        var paths = watchPath(event, 'src/sass/', 'src/css/');

        gutil.log(gutil.colors.green(event.type) + ' ' + paths.srcPath);
        gutil.log('Dist ' + paths.distPath);

        if (event.type === 'deleted') {
            var oldName = paths.distPath,
                newName = (function (name) {
                    var tmpName = name.split('.').slice(0, -1);
                    tmpName.push('min.js');
                    return tmpName.join('.');
                })(oldName),
                oldMap = oldName + '.map',
                newMap = newName + '.map';

            del([oldName, newName, oldMap, newMap]);                        // gulp-del 的删除 api
        } else {
            gulp.src(paths.srcPath)
                .pipe(sourcemaps.init())
                .pipe(sass.sync().on('error', sass.logError))
                .pipe(sourcemaps.write('./'))
                .pipe(gulp.dest(paths.distDir));
        }
    });
});

gulp.task('sass', function () {
    gulp.src('src/sass/**/*.scss')
        .pipe(sourcemaps.init())
        .pipe(sass.sync().on('error', sass.logError))
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest('src/css/'));
});

gulp.task('watchcss', function () {
    gulp.watch('src/css/**/*.css', function (event) {
        var paths = watchPath(event, 'src/', 'dist/');

        gutil.log(gutil.colors.green(event.type) + ' ' + paths.srcPath);
        gutil.log('Dist ' + paths.distPath);


        if (event.type === 'deleted') {
            var oldName = paths.distPath,
                newName = (function (name) {
                    var tmpName = name.split('.').slice(0, -1);
                    tmpName.push('min.js');
                    return tmpName.join('.');
                })(oldName),
                oldMap = oldName + '.map',
                newMap = newName + '.map';

            del([oldName, newName, oldMap, newMap]);                        // gulp-del 的删除 api
        } else {
            gulp.src(paths.srcPath)
                .pipe(sourcemaps.init())
                .pipe(autoprefixer({
                  browsers: 'last 3 versions'
                }))
                .pipe(minifycss())
                // .pipe(rename({ extname: '.min.css' }))
                .pipe(sourcemaps.write('./'))
                .pipe(gulp.dest(paths.distDir))
                .pipe(browserSync.stream());
        }
    });
});

gulp.task('css', function () {
    gulp.src('src/css/**/*.css')
        .pipe(sourcemaps.init())
        .pipe(autoprefixer({
          browsers: 'last 3 versions'
        }))
        .pipe(minifycss())
        // .pipe(rename({ extname: '.min.css' }))
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest('dist/css/'));
});

// 监视文件改动并重新载入
gulp.task('serve', function() {
    browserSync.init({
        server: "./"
    });

    gulp.watch('./**/*.html').on('change', browserSync.reload);

});

gulp.task('watchimages', function () {
    gulp.watch('src/images/**/*', function (event) {
        var paths = watchPath(event,'src/','dist/');

        gutil.log(gutil.colors.green(event.type) + ' ' + paths.srcPath);
        gutil.log('Dist ' + paths.distPath);


        if (event.type === 'deleted') {
            del([ paths.distPath ]);
        } else {
            gulp.src(paths.srcPath)
                .pipe(imagemin({
                    progressive: true
                }))
                .pipe(gulp.dest(paths.distDir));
        }
    });
});

gulp.task('images', function () {
    gulp.src('src/images/**/*')
        .pipe(imagemin({
            progressive: true
        }))
        .pipe(gulp.dest('dist/images'));
});

// gulp.task('watchcopy', function () {
//     gulp.watch('src/fonts/**/*', function (event) {
//         var paths = watchPath(event,'src/', 'dist/');

//         gutil.log(gutil.colors.green(event.type) + ' ' + paths.srcPath);
//         gutil.log('Dist ' + paths.distPath);


//         if (event.type === 'deleted') {
//             del([ paths.distPath ]);
//         } else {
//             gulp.src(paths.srcPath)
//                 .pipe(gulp.dest(paths.distDir));
//         }
//     });
// });

// gulp.task('copy', function () {
//     gulp.src('src/fonts/**/*')
//         .pipe(gulp.dest('dist/fonts/'));
// });


gulp.task('generate', ['js', 'sass', 'css', 'images']);
gulp.task('default', ['watchjs', 'watchsass', 'watchcss', 'watchimages','serve']);
