// Gulp.js configuration
const
  gulp            = require('gulp'),
  plugin          = require('../_inc/plugin'),
  config          = require('../_inc/config'),
  paths           = require('../_inc/paths')
;
// const { image, html, moveIndex } = require('./index');

const sass = () => {
  return gulp.src(paths.css.siteSass)
    .pipe(plugin.sourcemaps.init())
    .pipe(plugin.sass({
      outputStyle: 'nested', // set to expanded/compressed
      imagePath: 'images/',
      precision: 3,
      errLogToConsole: true
    }))
    .pipe(plugin.autoprefixer({
      cascade: true
    }))
    .pipe(plugin.cleancss({compatibility: 'ie9'}))
    .pipe(plugin.sourcemaps.write(''))
    .pipe(gulp.dest(paths.css.siteDest));
}

const bootstrapCss = () => {
  return gulp.src(paths.css.bsSass)
    .pipe(plugin.sourcemaps.init())
    .pipe(plugin.sass({
      outputStyle: 'nested', // set to expanded/compressed
      imagePath: 'images/',
      precision: 3,
      errLogToConsole: true
    }))
    .pipe(plugin.autoprefixer({
      cascade: true
    }))
    .pipe(plugin.cleancss({compatibility: 'ie10'}))
    .pipe(plugin.sourcemaps.write(''))
    .pipe(gulp.dest(paths.css.bsDest));
}

const criticalCss = () => {
  // let criticalpath = gulp.src([paths.site.dest+'**/*.html', '!'+paths.site.dest+'index/index.html'])
  let criticalpath = gulp.src([paths.site.dest+'**/*.html'])
  // minify production code
  if (process.env.NODE_ENV == 'Staging' || process.env.NODE_ENV == 'Production') {
    criticalpath = criticalpath
    .pipe(plugin.critical({
      base: paths.site.dest,
      inline: true,
      css: [paths.css.siteDest+'main.css', paths.css.siteDest+'bootstrap/bootstrap.css'],
      minify: true,
      include: ['#menutoggle', '.container.fluid'],
      timeout: 90000,
      penthouse: {
        timeout:                90000,
        pageLoadSkipTimeout:    30000,
        renderWaitTime:         400,
        blockJSRequest:         true
      },
      dimensions: [{
        width: 1200,
        height: 800
      }]
    }))
    .on('error', function(err) { gutil.log(gutil.colors.red(err.message)); })
  }
  return criticalpath.pipe(gulp.dest(paths.site.dest));
}

exports.sass = sass;
exports.bootstrapCss = bootstrapCss;
exports.criticalCss = criticalCss;
