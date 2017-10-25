// Gulp.js configuration
var
    // modules
    gulp            = require('gulp'),
    newer           = require('gulp-newer'),
    imagemin        = require('gulp-imagemin'),
    htmlclean       = require('gulp-htmlclean'),
    sass            = require('gulp-sass'),
    autoprefixer    = require('gulp-autoprefixer'),
    cleancss        = require('gulp-clean-css'),
    sourcemaps      = require('gulp-sourcemaps'),
    concat          = require('gulp-concat'),
    deporder        = require('gulp-deporder'),
    stripdebug      = require('gulp-strip-debug'),
    jshint          = require('gulp-jshint'),
    uglify          = require('gulp-uglify'),
    nunjucksRender  = require('gulp-nunjucks-render'),
    webserver       = require('gulp-webserver'),
    webp            = require('gulp-webp');
    fs              = require('fs-extra'),
    critical        = require('critical').stream,
    replace         = require('gulp-replace-task'),
    runSequence     = require('run-sequence'),
    swPrecache      = require('sw-precache'),

    // development mode?
    devBuild = (process.env.NODE_ENV !== 'Production'), //SET NODE_ENV=prod/dev or export NODE_ENV=prod/dev

    // Application Insights instrumentation key
    iKey     = '00000', // Replace with site's Application Insights unique instrumentation key ("iKey")

    // folders paths
    paths = {
        site: {
            src: '_src/',
            dest: '_build/'
        },
        html: {
            pages: '_src/pages/**/*.+(html|njk)',
            pagesfolder: '_src/pages/**/*',
            templates: '_src/templates/',
            templatesfolder: '_src/templates/**/*',
        },
        images: {
            folder: '_src/images/**/*',
            dest: '_build/images/'
        },
        css: {
            folder: '_src/scss/**/*',
            sass: '_src/scss/style.scss',
            dest: '_build/css/'
        },
        js: {
            folder: '_src/js/**/*',
            dest: '_build/js/'
        },
        fonts: {
            folder: '_src/font/**/*',
            dest: '_build/font/'
        },
        root: {
            folder: '_src/root/**/*',
        }
    }
;

// copy font folder
gulp.task('fonts', function() {
    return gulp.src(paths.fonts.folder)
        .pipe(newer(paths.fonts.dest))
        .pipe(gulp.dest(paths.fonts.dest));
});

// copy files that need to be in the root folder
gulp.task('rootfiles', function() {
    return gulp.src(paths.root.folder)
        .pipe(newer(paths.site.dest))
        .pipe(gulp.dest(paths.site.dest));
});

// image processing
gulp.task('images', ['imagemin', 'imagewebp']);
gulp.task('imagemin', function() {
    return gulp.src(paths.images.folder)
        .pipe(newer(paths.images.dest))
        .pipe(imagemin({ optimizationLevel: 5 }))
        .pipe(gulp.dest(paths.images.dest));
});
gulp.task('imagewebp', function() {
    imin([paths.images.folder+".png"], paths.images.dest, { use: [webp({ lossless: true })] });
    imin([paths.images.folder+".jpg"], paths.images.dest, { use: [webp({ quality: 65 })] });
});

// page/html processing
gulp.task('html', function() {
    var page = gulp.src(paths.html.pages)
        //.pipe(newer(paths.site.dest))
        .pipe(nunjucksRender({
            ext: '/index.html',
            path: [paths.html.templates]
        }));

    // Update application insights iKey
    page = page.pipe(replace({                          // Carry out the specified find and replace.
                patterns: [
                    {
                       match: 'INSTRUMENTATION_KEY',
                       replacement: function() { return iKey; }
                    }
                ],
                usePrefix: false
            }));

    // minify production code
    if (!devBuild) {
        page = page.pipe(htmlclean());
    }
    return page.pipe(gulp.dest(paths.site.dest));
});

// moving home index outside of "_build/index/ folder
gulp.task('rename-index', ['html'], function() {
    var move = fs.move (
        paths.site.dest + 'index/index.html',
        paths.site.dest + 'index.html',
        { clobber: true },
        function(err) {
            //if (err) return console.log(err);
            fs.remove(paths.site.dest + "index");
        }
    );
    return move;
});

// js processing
gulp.task('js-copy', function() {
    return gulp.src(paths.js.folder)
        .pipe(newer(paths.js.dest))
        .pipe(gulp.dest(paths.js.dest));
});

// JavaScript processing
gulp.task('js', function() {
    var jsbuild = gulp.src(paths.js.folder)
        .pipe(sourcemaps.init())
        .pipe(deporder())
        .pipe(concat('main.min.js'));
    // minify production code
    if (!devBuild) {
        jsbuild = jsbuild
            .pipe(stripdebug())
            .pipe(uglify())
            .pipe(sourcemaps.write(''));
    }
    return jsbuild.pipe(gulp.dest(paths.js.dest));
});

// CSS processing
gulp.task('css', ['images'], function() {
    return gulp.src(paths.css.sass)
        .pipe(sourcemaps.init())
        .pipe(autoprefixer({
            browsers: ['last 2 versions'],
            cascade: false
        }))
        .pipe(sass({
            outputStyle: 'nested', // set to expanded/compressed
            imagePath: 'images/',
            precision: 3,
            errLogToConsole: true
        }))
        .pipe(cleancss({compatibility: 'ie9'}))
        .pipe(sourcemaps.write(''))
        .pipe(gulp.dest(paths.css.dest));
});

// generate and inline critical css
gulp.task('critical', ['css', 'html', 'rename-index'], function () {
    var criticalpath =  gulp.src(paths.site.dest+'**/*.html')
        // minify production code
        if (!devBuild) {
            criticalpath = criticalpath
            .pipe(critical({
                base: paths.site.dest,
                inline: true,
                css: [paths.css.dest+'style.css'],
                minify: true,
                include: ['#menutoggle', '.container.fluid'],
                dimensions: [{
                    width: 1200,
                    height: 750
                }]
            }))
        }
        return criticalpath.pipe(gulp.dest(paths.site.dest));
});

// local webserver
gulp.task('webserver', ['watch', 'rename-index', 'critical'], function() {
    return gulp.src(paths.site.dest)
        .pipe(webserver({
            //https: true,
            livereload: true,
            open: true
        }));
});

gulp.task('generate-service-worker', function(callback) {
    swPrecache.write(paths.site.dest + "service-worker.js", {
        staticFileGlobs: [
            paths.site.dest + '/!(articles)/**/*.{js,html,css,png,jpg,gif,svg,eot,ttf,woff}',
            paths.site.dest + '/*.{js,html,css}'
        ],
        runtimeCaching: [{
            urlPattern: /^http([s]*):\/\/(.*)\.googleapis\.com\/(.*)/,
            handler: 'networkFirst',
            options: {
                cache: {
                    maxEntries: 5,
                    name: 'google-cache'
                }
            }
        }],
        stripPrefix: paths.site.dest
    }, callback);
});

// watch for changes
gulp.task('watch', function() {
    // pages changes
    gulp.watch(paths.html.pagesfolder, ['build']);
    // template changes
    gulp.watch(paths.html.templatesfolder, ['build']);
    // image changes
    gulp.watch(paths.images.folder, ['build']);
    // javascript changes
    gulp.watch(paths.js.folder, ['build']);
    // css changes
    gulp.watch(paths.css.folder, ['build']);
    // fonts changes
    gulp.watch(paths.fonts.folder, ['build']);
    // root files changes
    gulp.watch(paths.root.folder, ['build']);
});

// run folder tasks
gulp.task('do-all', ['html', 'images', 'css', 'js', 'js-copy', 'fonts', 'rootfiles', 'critical']);

gulp.task('build', function(callback) {
  runSequence('do-all', 'generate-service-worker', callback);
});

// default task
gulp.task('default', ['build', 'watch', 'webserver']);
