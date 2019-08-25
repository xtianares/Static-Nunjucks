// Gulp.js configuration
const
  // modules
  gulp            = require('gulp'),
  plugin          = require('../_inc/plugin'),
  config          = require('../_inc/config'),
  paths           = require('../_inc/paths')
;

// copy files that need to be in the root folder
gulp.task('rootfiles', function() {
  let rootfiles = gulp.src(paths.root.files)

  if (process.env.NODE_ENV == 'Staging' || process.env.NODE_ENV == 'Production') {
    rootfiles = rootfiles
      .pipe(plugin.replace(
        '<!--<mimeMap fileExtension=".json" mimeType="application/json" />-->',
        '<mimeMap fileExtension=".json" mimeType="application/json" />'
      ));
  }

  return rootfiles.pipe(gulp.dest(paths.site.dest));
});

gulp.task('set-dl-env', function() {
  return process.env.NODE_ENV = 'Development';
});
gulp.task('set-ml-env', function() {
  return process.env.NODE_ENV = 'Staging';
});
gulp.task('set-prod-env', function() {
  return process.env.NODE_ENV = 'Production';
});

// clean the _build folder
gulp.task('site:clean', function() {
  let clean = plugin.fs.emptyDirSync(paths.site.dest, err => {
    if (err) return console.error(err);
    console.log('build folder cleaned!');
  });
  return clean;
});

// watch for changes
gulp.task('watch', function() {
  gulp.watch(paths.html.sitePages, ['html']);
  gulp.watch(paths.html.templatesFiles, ['html']);
  gulp.watch(paths.images.siteFiles, ['images']);
  gulp.watch(paths.js.siteFiles, ['js']);
  gulp.watch(paths.css.siteFiles, ['css']);
  gulp.watch(paths.root.files, ['rootfiles']);
});

// local webserver
gulp.task('webserver', ['watch', 'site:critical'], function () {
  return gulp.src(paths.site.dest)
    .pipe(plugin.webserver({
      //https: true,
      port: 8001,
      livereload: true,
      open: true
    }));
});
