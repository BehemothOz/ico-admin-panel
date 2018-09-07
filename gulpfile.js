'use strict';

const gulp = require('gulp'),
      pug = require('gulp-pug'),
      sass = require('gulp-sass'),
      autoprefixer = require('gulp-autoprefixer'),
      sourcemaps = require('gulp-sourcemaps'),
      plumber = require('gulp-plumber'),
      notify = require('gulp-notify'),
      uglify = require('gulp-uglify'),
      clean = require('gulp-clean');

const browserSync = require('browser-sync');

const paths = {

    develop: {
        html: 'develop',
        css: 'develop/css',
        js: 'develop/js',
        jsLibs: 'develop/js/libs',
        img: 'develop/img',
        fonts: 'develop/fonts'
    },

    src: {
        html: 'pug/*.pug',
        scss: 'scss/style.scss',
        js: 'js/*.js',
        jsLibs: 'js/libs/*.js',
        img: 'img/**/*.{jpg,png,svg}',
        fonts: 'fonts/*.*'
    },

    clean: {
        develop: 'develop'
    }
};


// Pug
gulp.task('html', function buildHTML() {
    return gulp.src(paths.src.html)
        .pipe(pug({
            pretty: true
        }))
        .pipe(gulp.dest(paths.develop.html));
});


// Scss
gulp.task('scss', function () {
    return gulp.src(paths.src.scss)
        .pipe(plumber({
            errorHandler: notify.onError(function (err) {
                return {
                    title: 'SCSS',
                    message: err.message
                };
            })
        }))
        .pipe(sourcemaps.init())
        .pipe(sass({ outputStyle: 'expanded' }))
        .pipe(autoprefixer())
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest(paths.develop.css))
});


// Copy JS
gulp.task('copy:js', function () {
    return gulp.src(paths.src.js)
        .pipe(sourcemaps.init())
        // .pipe(uglify())
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest(paths.develop.js))
});


// Copy JS libs
gulp.task('copy:js:libs', function () {
    return gulp.src(paths.src.jsLibs)
        .pipe(gulp.dest(paths.develop.jsLibs))
});


// Copy images
gulp.task('copy:img', function () {
    return gulp.src(paths.src.img)
        .pipe(gulp.dest(paths.develop.img))
});


// Copy fonts
gulp.task('copy:fonts', function () {
    return gulp.src(paths.src.fonts)
        .pipe(gulp.dest(paths.develop.fonts))
});


// Clean develop
gulp.task('clean:dev', function () {
    return gulp.src(paths.clean.develop, {read: true})
        .pipe(clean({force: true}));
});;


// Watch
gulp.task('watch', function () {
    gulp.watch('pug/**/*.pug', gulp.series('html'));
    gulp.watch('scss/**/*.scss', gulp.series('scss'));
    gulp.watch('js/*.js', gulp.series('copy:js'));
    gulp.watch('js/libs/*.js', gulp.series('copy:js:libs'));
    gulp.watch('img/**/*.{jpg,png,svg}', gulp.series('copy:img'));
    gulp.watch('fonts/*.*', gulp.series('copy:fonts'));
});


// BrowserSync
gulp.task('server', function () {
    browserSync({
        server: {
            baseDir: "develop/",
        },
        port: 3222,
        notify: false
    });

    browserSync.watch('develop/**/*').on('change', browserSync.reload);
});


// Default run
gulp.task('default', 
        gulp.series(
            'html',
            'scss',
            'copy:js',
            'copy:js:libs',
            'copy:img',
            'copy:fonts',
            'watch')
);
