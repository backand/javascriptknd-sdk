import gulp from 'gulp';
import clean from 'gulp-clean';
import browserify from 'browserify';
import source from 'vinyl-source-stream';
import gutil from 'gulp-util';
import babelify from 'babelify';
import buffer from 'vinyl-buffer';
import uglify from 'gulp-uglify';
import sourcemaps from 'gulp-sourcemaps';
import livereload from 'gulp-livereload';

const paths = {
    src:  { js: './src/index.js'},
    dest: { js: './dist'}
};

gulp.task('clean', function () {
  return gulp.src(paths.dest.js)
    .pipe(clean({force: true}));
});

gulp.task('build', ['clean'], ()=> {
  return browserify({ entries: paths.src.js, debug: true })
  	.transform("babelify", {presets: ["es2015"]})
    .bundle()
    // .on('error',gutil.log)
    .pipe(source('backand.js'))
    .pipe(buffer())
    .pipe(sourcemaps.init())
    .pipe(uglify())
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest(paths.dest.js))
});

gulp.task('watch', ()=> {
  gulp.watch('./src/**/*.js', ['build']);
});

gulp.task('default', ['build']);




// gulp.task('build', ['clean'], ()=> {
//     return gulp.src(paths.src.js)
// 		.pipe(babel())
// 		.pipe(gulp.dest(paths.dest.js));
// });