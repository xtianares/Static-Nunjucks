// Gulp.js configuration
const
  // modules
  gulp            = require('gulp'),
  plugin          = require('../_inc/plugin'),
  config          = require('../_inc/config'),
  paths           = require('../_inc/paths')
;

// CSS processing using sass
gulp.task('css', ['images'], function() {
  return gulp.src(paths.css.siteSass)
    .pipe(plugin.sourcemaps.init())
    .pipe(plugin.sass({
      outputStyle: 'nested', // set to expanded/compressed
      imagePath: 'images/',
      precision: 3,
      errLogToConsole: true
    }))
    .pipe(plugin.autoprefixer({
      browsers: [
        '>= 1%',
        'last 1 major version',
        'not dead',
        'Chrome >= 45',
        'Firefox >= 38',
        'Edge >= 12',
        'Explorer >= 10',
        'iOS >= 9',
        'Safari >= 9',
        'Android >= 4.4',
        'Opera >= 30'
      ],
      cascade: true
    }))
    .pipe(plugin.cleancss({compatibility: 'ie9'}))
    .pipe(plugin.sourcemaps.write(''))
    .pipe(gulp.dest(paths.css.siteDest));
});

// CSS processing using sass
gulp.task('bootstrap_css', ['css'], function() {
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
});

// generate and inline critical css for all pages
gulp.task('site:critical', ['css', 'site:nunjucks'], function () {
  var criticalpath =  gulp.src([paths.site.dest+'**/*.html', '!'+paths.site.dest+'index/index.html'])
  // minify production code
  if (process.env.NODE_ENV == 'Staging' || process.env.NODE_ENV == 'Production') {
    criticalpath = criticalpath
    .pipe(plugin.critical({
      base: paths.site.dest,
      inline: true,
      css: [paths.css.siteDest+'site.css'],
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
});
