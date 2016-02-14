/**
 * Gulp config options
 *
 * @copyright Copyright (c) 2016, hugw.io
 * @author Hugo W - me@hugw.io
 * @license MIT
 */

/**
 * Vendor
 *
 * Paths and files to be
 * compiled into vendor.min.js
 */
export const vendor = {
  dev: {
    src: [
      './bower_components/jquery/dist/jquery.min.js',
      './bower_components/lodash/dist/lodash.min.js'
    ],
    dest: './src/assets/js/',
    file: 'vendor.min.js'
  },
};

/**
 * Dist
 *
 * Paths to be copied
 * to ./dist folder
 */
export const dist = {
  src: [
    './src/index.html',
    './src/assets/css/**/*',
    './src/assets/js/**/*',
    './src/assets/imgs/**/*',
    './src/assets/sass/**/*',
    '!./src/assets/js/*.map',
    '!./src/assets/sass/docs.scss',
  ],
  dest: './dist'
};

/**
 * Html templates
 *
 * Paths to be compiled
 * to .html using ejs
 */
export const html = {
  src: './src/templates/*.ejs',
  partials: './src/templates/partials/*.ejs',
  dest: './src/'
};

/**
 * Stylesheets
 *
 * Paths to be
 * compiled to .css
 */
export const styles = {
  src: ['./src/assets/sass/**/*.scss', '!./src/assets/sass/vendor/**/*.scss'],
  dest: './src/assets/css/'
};

/**
 * JS Scripts
 *
 * Paths to be compiled
 * and minimized
 */
export const scripts = {
  src: './src/assets/js/scripts.js',
  dest: './src/assets/js/',
  file: 'scripts.min.js'
};

/**
 * Linter
 *
 * Paths to be checked
 * using ESLint
 */
export const linter = {
  src: [
    './src/assets/js/scripts.js',
    './gulp/**/*.js',
    './gulpfile.js'
  ]
};
