// Gulp.js configuration
const
  // modules
  gulp            = require('gulp'),
  plugin          = require('../_inc/plugin'),
  config          = require('../_inc/config'),
  paths           = require('../_inc/paths')
;

// copy files that need to be in the root folder
gulp.task('rootfiles', () => {
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

// generate sitemap.xml file
gulp.task('sitemap', () => {
  gulp.src([paths.site.dest + '**/*.html'], {
    read: false
  })
  .pipe(plugin.sitemap({
      siteUrl: config.site_url // this is set in the config.xml
  }))
  .pipe(gulp.dest(paths.site.dest));
});

gulp.task('generate-service-worker', () => {
  return plugin.workboxBuild.generateSW({
    // wSrc: 'src/sw.js',
    swDest: paths.site.dest + "sw.js",
    globDirectory: paths.site.dest,
    globPatterns: [
      // '**/*.{html,json,js,css}',
      '!(registration)/**/*.{js,html,css,png,jpg,gif,svg,eot,ttf,woff}',
      '*.{js,html,css}'
    ],
    runtimeCaching: [
      {
        urlPattern: /^http([s]*):\/\/(.*)\.googleapis\.com\/(.*)/,
        handler: 'NetworkFirst',
        options: {
          cacheName: 'google-cache',
          expiration: {
            maxAgeSeconds: 60 * 60 * 24 * 7,
          },
        },
      }
    ],
  }).then(({count, size, warnings}) => {
    // Optionally, log any warnings and details.
    warnings.forEach(console.warn);
    console.log(`${count} files will be precached, totaling ${size} bytes.`);
  });
});

gulp.task('set-dl-env', () => {
  return process.env.NODE_ENV = 'Development';
});
gulp.task('set-ml-env', () => {
  return process.env.NODE_ENV = 'Staging';
});
gulp.task('set-prod-env', () => {
  return process.env.NODE_ENV = 'Production';
});

// clean the _build folder
gulp.task('clean', function() {
  let clean = plugin.fs.emptyDirSync(paths.site.dest, err => {
    if (err) return console.error(err);
    console.log('build folder cleaned!');
  });
  return clean;
});

// watch for changes
gulp.task('watch', () => {
  gulp.watch(paths.html.sitePages, ['html']);
  gulp.watch(paths.html.templatesFiles, ['html']);
  gulp.watch(paths.images.siteFiles, ['images']);
  gulp.watch(paths.js.siteFiles, ['js']);
  gulp.watch(paths.css.siteFiles, ['css']);
  gulp.watch(paths.root.files, ['rootfiles']);
});

// local webserver
gulp.task('webserver', ['watch', 'css:critical'], () => {
  return gulp.src(paths.site.dest)
    .pipe(plugin.webserver({
      //https: true,
      port: 8001,
      livereload: true,
      open: true
    }));
});
