// Gulp.js configuration
const
  // modules
  gulp            = require('gulp'),
  plugin          = require('../_inc/plugin'),
  config          = require('../_inc/config'),
  paths           = require('../_inc/paths')
;

// image processing
gulp.task('site:imagemin', function() {
  return gulp.src(paths.images.siteFiles)
    .pipe(plugin.newer(paths.images.siteDest))
    .pipe(plugin.imagemin([
        plugin.imagemin.gifsicle({interlaced: true}),
        plugin.imagemin.jpegtran({progressive: true}),
        plugin.imagemin.optipng({optimizationLevel: 5}),
        plugin.imagemin.svgo({
            plugins: [
                {removeViewBox: true},
                {cleanupIDs: false}
            ]
        })
    ]))
    .pipe(gulp.dest(paths.images.siteDest));
});

gulp.task('site:imagewebp', function() {
  return gulp.src(paths.images.siteFiles)
    .pipe(plugin.newer(paths.images.siteDest))
    .pipe(plugin.webp({ lossless: true, quality: 65 }))
    .pipe(gulp.dest(paths.images.siteDest));
});

gulp.task('images', ['site:imagemin', 'site:imagewebp']);
