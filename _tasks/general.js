// Gulp.js configuration
const
  gulp            = require('gulp'),
  plugin          = require('../_inc/plugin'),
  config          = require('../_inc/config'),
  paths           = require('../_inc/paths')
;

// I have no idea why this needs to be reference like this, watch (gulp.series) fails if it's reference via the export file
const
  sass            = require('./css').moveIndex,
  html            = require('./html').html,
  moveIndex       = require('./html').moveIndex,
  imagemin        = require('./image').imagemin,
  imagewebp       = require('./image').imagewebp,
  jsConcat        = require('./javascript').jsConcat,
  jsCopy          = require('./javascript').jsCopy
;

// copy files that need to be in the root folder
const rootFiles = () => {
  let rootfiles = gulp.src(paths.root.files)
  if (process.env.NODE_ENV == 'Staging' || process.env.NODE_ENV == 'Production') {
    rootfiles = rootfiles
      .pipe(plugin.replace(
        '<!--<mimeMap fileExtension=".json" mimeType="application/json" />-->',
        '<mimeMap fileExtension=".json" mimeType="application/json" />'
      ));
  }
  return rootfiles.pipe(gulp.dest(paths.site.dest));
};

// generate sitemap.xml file
const sitemap = () => {
  return gulp.src([paths.site.dest + '**/*.html'], {
    read: false
  })
  .pipe(plugin.sitemap({
      siteUrl: config.site_url // this is set in the config.xml
  }))
  .pipe(gulp.dest(paths.site.dest));
};

const generateServiceWorker = () => {
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
};

const set_dl_env = (cb) => {
  process.env.NODE_ENV = 'Development';
  cb();
};
const set_ml_env = (cb) => {
  process.env.NODE_ENV = 'Staging';
  cb();
};
const set_prod_env = (cb) => {
  process.env.NODE_ENV = 'Production';
  cb();
};

// clean the _build folder
const clean = (cb) => {
  plugin.fs.emptyDirSync(paths.site.dest, err => {
    if (err) return console.error(err);
    console.log('build folder cleaned!');
  });
  cb();
};

// watch for changes
const watch = (cb) => {
  gulp.watch(paths.html.sitePages, gulp.series(html, moveIndex));
  gulp.watch(paths.html.templatesFiles, gulp.series(html, moveIndex));
  gulp.watch(paths.images.siteFiles, gulp.series(imagemin, imagewebp));
  gulp.watch(paths.js.siteFiles, gulp.series(jsConcat, jsCopy));
  gulp.watch(paths.css.siteFiles, sass);
  gulp.watch(paths.root.files, rootFiles);
  cb();
};

// local webserver
const webServer = () => {
  return gulp.src(paths.site.dest)
    .pipe(plugin.webserver({
      //https: true,
      port: 8001,
      livereload: true,
      open: true
    }));
};

exports.rootFiles = rootFiles;
exports.sitemap = sitemap;
exports.generateServiceWorker = generateServiceWorker;
exports.set_dl_env = set_dl_env;
exports.set_ml_env = set_ml_env;
exports.set_prod_env = set_prod_env;
exports.clean = clean;
exports.watch = watch;
exports.webServer = webServer
