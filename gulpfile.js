const gulp = require('gulp');
const { watch, series } = require('gulp');
const fileinclude = require('gulp-file-include');
const sass = require('gulp-sass');
const sourcemaps = require('gulp-sourcemaps');
const cleanCSS = require('gulp-clean-css');
//const clean = require('gulp-clean');
const autoprefixer = require('gulp-autoprefixer');
const concat = require('gulp-concat');
const htmlbeautify = require('gulp-html-beautify');
const server = require('browser-sync').create();
sass.compiler = require('node-sass');

const paths = {
  scripts: {
    src: './',
    dest: './build/'
  },
  style: {
    src: './',
    dest: './build/assets/'
  }
};

// Reload Server
async function reload() {
  server.reload();
}

// Sass compiler
async function compileSass() {
  return gulp.src([
    './assets/css/sass/*.scss',
    '!./assets/css/sass/mixin.scss',
    '!./assets/css/sass/stylesheet.scss',
  ])
    .pipe(sourcemaps.init())
    .pipe(sass().on('error', sass.logError))
    .pipe(autoprefixer())
    .pipe(concat('style.css'))
    .pipe(sourcemaps.write())
    .pipe(cleanCSS({ compatibility: 'ie8' }))
    .pipe(gulp.dest('./build/assets/css/'))
    .pipe(server.stream());
}

// Copy assets after build
async function copyAssets() {
  gulp.src([
    'assets/**/*',
    '!assets/css/sass/*'
  ])
  .pipe(gulp.dest(paths.style.dest));
}

// async function cleanAssets() {
//   gulp.src([
//     'build/*'
//     //'build/*.html'
//   ])
//   .pipe(clean(gulp.dest(paths.style.dest)));
// }
// async function htmlBeautify() {
//   var options = {
//     "indent_size": 4,
//     "indent_char": " ",
//     "eol": "\n",
//     "indent_level": 0,
//     "indent_with_tabs": false,
//     "preserve_newlines": true,
//     "max_preserve_newlines": 10,
//     "jslint_happy": false,
//     "space_after_anon_function": false,
//     "brace_style": "collapse",
//     "keep_array_indentation": false,
//     "keep_function_indentation": false,
//     "space_before_conditional": true,
//     "break_chained_methods": false,
//     "eval_code": false,
//     "unescape_strings": false,
//     "wrap_line_length": 0,
//     "wrap_attributes": "auto",
//     "wrap_attributes_indent_size": 4,
//     "end_with_newline": false
//   }
//   gulp.src('./build/*.html')
//   .pipe(htmlbeautify(options))
//   .pipe(gulp.dest(paths.scripts.dest))
// }

// Build files html and reload server
async function buildAndReload() {
  await includeHTML();
  await compileSass();
  //await cleanAssets();
  await copyAssets();
  //await htmlBeautify();
  reload();
}

async function includeHTML() {
  return gulp.src([
    './views/*.html',
    '!./views/template/*.html'
  ])
    .pipe(fileinclude({
      prefix: '@@',
      basepath: '@file'
    }))
    .pipe(htmlbeautify())
    .pipe(gulp.dest(paths.scripts.dest));
}
exports.includeHTML = includeHTML;

exports.default = async function () {
  // Init serve files from the build folder
  server.init({
    server: {
      baseDir: paths.scripts.dest
    }
  });
  // Build and reload at the first time
  buildAndReload();
  // Watch Sass task
  watch('./assets/css/sass/*.scss', series(compileSass));
  // Watch task
  watch(["./views/*.html", "./views/template/*.html"], series(buildAndReload));
  watch(["./assets/**"], series(buildAndReload));
};