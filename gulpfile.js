var gulp        = require('gulp');
var browserSync = require('browser-sync').create();
var sass        = require('gulp-sass');
var historyApiFallback = require('connect-history-api-fallback');

// Static Server + watching scss/html files
gulp.task('serve', ['sass'], function () {
    browserSync.init({
        server: {
            baseDir: 'app',
            middleware: [ historyApiFallback() ]
        }
    });
});

gulp.task('watch', ['serve'], function () {
    gulp.watch("app/scss/*.scss", ['sass']).on('change', browserSync.reload);
    gulp.watch("app/js/*.js").on('change', browserSync.reload);
    gulp.watch("app/templates/*.html").on('change', browserSync.reload);
    gulp.watch("app/index.html").on('change', browserSync.reload);
})

// Compile sass into CSS & auto-inject into browsers
gulp.task('sass', function () {
    return gulp.src("app/scss/*.scss")
        .pipe(sass())
        .pipe(gulp.dest("app/css"))
        .pipe(browserSync.stream());
});

gulp.task('default', ['watch']);
