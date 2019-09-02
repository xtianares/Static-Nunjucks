// Gulp.js configuration
const
  // modules
  gulp            = require('gulp'),
  plugin          = require('../_inc/plugin'),
  config          = require('../_inc/config'),
  paths           = require('../_inc/paths')
;

// site js processing
gulp.task('js:concat', () => {
  let jsbuild = gulp.src(paths.js.siteRootFiles)
    .pipe(plugin.sourcemaps.init())
    .pipe(plugin.deporder())
    .pipe(plugin.babel({
			presets: ['@babel/preset-env']
		}))
    .pipe(plugin.concat('main.min.js'));

    config.set(jsbuild); // run replacement settings from config file

  // minify production code
  if (process.env.NODE_ENV == 'Staging' || process.env.NODE_ENV == 'Production') {
    jsbuild = jsbuild
      //.pipe(plugin.stripdebug())
      .pipe(plugin.uglify());
  }
  jsbuild = jsbuild.pipe(plugin.sourcemaps.write(''));

  return jsbuild.pipe(gulp.dest(paths.js.siteDest));
});

// copying js files to build forder
gulp.task('js:copy', () => {
  return gulp.src([paths.js.siteFiles])
    .pipe(plugin.newer(paths.js.siteDest))
    .pipe(plugin.babel({
			presets: ['@babel/preset-env']
		}))
    .pipe(gulp.dest(paths.js.siteDest));
});

// js processing
gulp.task('js', ['js:concat', 'js:copy']);
