/*
 * @Author: JASON 
 * @Date: 2019-02-18 09:25:34 
 * @Last Modified by: JASON
 * @Last Modified time: 2019-02-18 10:07:19
 */
var gulp = require('gulp'); //开启gulp
var scss = require('gulp-sass'); //编译scss
var zipCSS = require('gulp-clean-css'); //压缩css
var webserver = require('gulp-webserver'); //webserver服务
var zipjs = require('gulp-uglify');
var babel = require('gulp-babel');
var htmlmin = require('gulp-htmlmin')
    //开发环境
    //编译scss
gulp.task('compileSass', function() {
    return gulp.src('./src/scss/**/*.scss')
        .pipe(scss())
        .pipe(gulp.dest('./src/css'))
        .pipe(zipCSS()) //压缩css文件
        .pipe(gulp.dest('./dist/css')) //打包dist文件夹
});
//启服务
gulp.task('startWebserver', function() {
    return gulp.src('src')
        .pipe(webserver({
            port: 3000,
            livereload: true,
        }))
});
//监听文件 
gulp.task('wathchs', function() {
    return gulp.watch('./src/scss/**/*.scss', gulp.series('compileSass'))
});
//线上环境
//压缩js
gulp.task('zipJS', function() {
    return gulp.src('./src/js/**/*.js')
        .pipe(babel({
            presets: ['@babel/env']
        }))
        .pipe(zipjs())
        .pipe(gulp.dest('./dist/js')) //打包dist文件夹
});
//压缩html
gulp.task('minify', () => {
    return gulp.src('./src/*.html')
        .pipe(htmlmin({ collapseWhitespace: true }))
        .pipe(gulp.dest('dist'));
});
//默认任务
gulp.task('default', function() {
    return gulp.series('startWebserver', 'wathchs', 'compileSass', 'zipJS', )
});

//上线
gulp.task('build', function() {
    return gulp.watch(['./src/scss/**/*.scss', './src/js/**/*.js'], gulp.parall('compileSass', 'zipJS'))
});