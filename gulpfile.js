// Gulp.js configuration
var
  gulp            = require('gulp'),
  plugin          = require('./_inc/plugin'),
  config          = require('./_inc/config'),
  paths           = require('./_inc/paths')
;

const {
  sass,
  bootstrapCss,
  criticalCss,
  rootFiles,
  sitemap,
  generateServiceWorker,
  set_dl_env,
  set_ml_env,
  set_prod_env,
  clean,
  watch,
  webServer,
  html,
  moveIndex,
  imagemin,
  imagewebp,
  jsConcat,
  jsCopy
} = require('./_tasks');


// run folder tasks
const doAll = gulp.parallel(imagemin, imagewebp, jsConcat, jsCopy, rootFiles, gulp.series(gulp.parallel(sass, bootstrapCss), html, criticalCss, moveIndex, sitemap));

const build = (cb) => {
  if (process.env.NODE_ENV == 'Staging' || process.env.NODE_ENV == 'Production') {
    return gulp.series(clean, doAll, generateServiceWorker)(cb);
  } else {
    return gulp.series(clean, doAll)(cb);
  }
}

// default task for Devs (their local environment)
const local = gulp.series(build, watch, webServer);

// default task for Devs (DL environment)
const dev = gulp.series(set_dl_env, build, watch, webServer);

// default task for Devs (ML environmens)
const staging = gulp.series(set_ml_env, build, watch, webServer);

// default task for Devs (Production environment)
const prod = gulp.series(set_prod_env, build, watch, webServer);

// exports.sass = sass;
// exports.bootstrapCss = bootstrapCss;
// exports.criticalCss = criticalCss;
// exports.rootFiles = rootFiles;
// exports.sitemap = sitemap;
// exports.generateServiceWorker = generateServiceWorker;
// exports.set_dl_env = set_dl_env;
// exports.set_ml_env = set_ml_env;
// exports.set_prod_env = set_prod_env;
// exports.clean = clean;
// exports.watch = watch;
// exports.webServer = webServer;
// exports.html = html;
// exports.moveIndex = moveIndex;
// exports.imagemin = imagemin;
// exports.imagewebp = imagewebp;
// exports.jsConcat = jsConcat;
// exports.jsCopy = jsCopy;

exports.doAll = doAll;
exports.build = build;
exports.local = local;
exports.dev = dev;
exports.staging = staging;
exports.prod = prod;

// default task
exports.default = gulp.series(set_dl_env, build, watch, webServer);
