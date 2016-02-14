/**
 * Gulp tasks
 *
 * @copyright Copyright (c) 2016, hugw.io
 * @author Hugo W - me@hugw.io
 * @license MIT
 */

// Load config variables
import * as config from './config';

// Load core modules
import gulp from 'gulp';
import watch from 'gulp-watch';

// Load util modules
import util from 'gulp-util';
import plumber from 'gulp-plumber';
import rename from 'gulp-rename';
import concat from 'gulp-concat';
import runsec from 'run-sequence';
import del from 'del';

// Load server modules
import bsync from 'browser-sync';
import compress from 'compression';

// Load stylesheet modules
import cssmin from 'gulp-minify-css';
import sass from 'gulp-sass';

// Load html modules
import ejs from 'gulp-ejs';

// Load javascript modules
import smaps from 'gulp-sourcemaps';
import uglify from 'gulp-uglify';
import babel from 'gulp-babel';

// Load linter modules
import eslint from 'gulp-eslint';

/**
 * Error handler
 *
 * Invoked by plumber and
 * other error and warning
 * listeners
 */
const onError = (err) => {
  util.beep();
  util.log(util.colors.red(err));
};

/**
 * Setup browserSync
 */
const browserSync = bsync.create();

/**
 * Html task
 *
 * Compile html files
 * using ejs
 */
gulp.task('_dev:html', () => {
  return gulp.src(config.html.src)
    .pipe(plumber({ errorHandler: onError }))
    .pipe(ejs())
    .pipe(rename({ extname: '.html', dirname: '' }))
    .pipe(gulp.dest(config.html.dest));
});


/**
 * Styles task
 *
 * All .scss are compiled
 * into .css files
 */
gulp.task('_dev:styles', () => {
  return gulp.src(config.styles.src)
    .pipe(plumber({ errorHandler: onError }))
    .pipe(sass().on('error', sass.logError))
    // Strip comments and keep line breaks
    .pipe(cssmin({ keepSpecialComments: 1, rebase: true, keepBreaks: true, processImport: false }))
    .pipe(rename({ dirname: '' }))
    // Generate .css
    .pipe(gulp.dest(config.styles.dest))
    // Now minify and strip line breaks
    .pipe(cssmin({ keepSpecialComments: 1, rebase: true, processImport: false }))
    .pipe(rename({ extname: '.min.css', dirname: '' }))
    // Generate .min.css
    .pipe(gulp.dest(config.styles.dest))
    .pipe(browserSync.stream());
});

/**
 * Linter task
 */
gulp.task('_dev:linter', () => {
  return gulp.src(config.linter.src)
    .pipe(plumber({ errorHandler: onError }))
    .pipe(eslint())
    .pipe(eslint.format());
});

/**
 * Vendor tasks
 *
 * Bundle vendor libs
 * into a single
 * script file
 */
gulp.task('_dev:vendor', () => {
  return gulp.src(config.vendor.dev.src)
    .pipe(plumber({ errorHandler: onError }))
    // Load current sourcemaps paths
    .pipe(smaps.init({ loadMaps: true }))
      .pipe(concat(config.vendor.dev.file))
    .pipe(smaps.write('./'))
    .pipe(gulp.dest(config.vendor.dev.dest));
});

/**
 * Scripts task
 *
 * Bundle js scripts
 * into a single file
 */
gulp.task('_dev:scripts', () => {
  return gulp.src(config.scripts.src)
    .pipe(plumber({ errorHandler: onError }))
    .pipe(smaps.init())
      .pipe(babel({ presets: ['es2015'] }))
      .pipe(concat(config.scripts.file))
      .pipe(uglify({
        output: { comments: /^!/i }
      }))
    .pipe(smaps.write('./'))
    .pipe(gulp.dest(config.scripts.dest));
});

/**
 * Server tasks
 *
 * Create and run a
 * development webserver
 */
gulp.task('_dev:server', () => {
  browserSync.init({
    server: { baseDir: `./src` },
    open: false,
    port: 5001,
    ui: { port: 5011 },
    middleware: [compress()]
  });
});

/**
 * Watch task
 *
 * Watch files and folder to auto
 * rerun specific tasks
 */
gulp.task('_dev:watch', () => {
  // Stylesheets
  watch(config.styles.src, { verbose: true }, () => runsec('_dev:styles'));

  // Html templates
  watch([config.html.src, config.html.partials], { verbose: true }, () => runsec('_dev:html', browserSync.reload));

  // JS scripts
  watch(config.scripts.src, { verbose: true }, () => runsec('_dev:scripts', browserSync.reload));

  // Linter
  watch(config.linter.src, { verbose: true }, () => runsec('_dev:linter'));
});

/**
 * Dist tasks
 *
 * Collect only the
 * necessary files to run
 * the app on a production
 * environment and copy
 * them to a dist folder
 */
gulp.task('_dist:clean', () => {
  return del(config.dist.dest);
});

gulp.task('_dist:copy', () => {
  return gulp.src(config.dist.src, { base: './src' })
    .pipe(plumber({ errorHandler: onError }))
    .pipe(gulp.dest(config.dist.dest));
});

/**
 * Global tasks
 *
 * "Public" tasks to be
 * invoked on console
 * with gulp or via package scripts
 */
gulp.task('default', ['dev:server']);

gulp.task('dev', (cb) => {
  runsec('_dev:linter', '_dev:styles', '_dev:html', '_dev:vendor', '_dev:scripts', cb);
});

gulp.task('dev:server', () => {
  runsec('dev', '_dev:watch', '_dev:server');
});

gulp.task('dist', () => {
  runsec('dev', '_dist:clean', '_dist:copy');
});
