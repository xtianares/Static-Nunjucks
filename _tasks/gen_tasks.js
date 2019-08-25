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

// generate sitemap.xml file
gulp.task('sitemap', function () {
    gulp.src([paths.site.dest + '**/*.html', '!_build/registration/**/*.html'], {
            read: false
        })
        .pipe(plugin.sitemap({
            siteUrl: config.site_url // this is set in the config.xml
        }))
        .pipe(gulp.dest(paths.site.dest));
});

gulp.task('generate-service-worker', function(callback) {
    swPrecache.write(paths.site.dest + "service-worker.js", {
        //staticFileGlobs: [paths.site.dest + '/**/*.{js,html,aspx,css,png,jpg,webp,gif,svg,eot,ttf,woff}'],
        staticFileGlobs: [
            paths.site.dest + '/!(registration)/**/*.{js,html,css,png,jpg,gif,svg,eot,ttf,woff}',
            paths.site.dest + '/*.{js,html,css}'
        ],
        runtimeCaching: [{
            urlPattern: /^http([s]*):\/\/(.*)\.googleapis\.com\/(.*)/,
            handler: 'networkFirst',
            options: {
                cache: {
                    maxEntries: 10,
                    name: 'google-cache'
                }
            }
        }],
        stripPrefix: paths.site.dest
    }, callback);
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
