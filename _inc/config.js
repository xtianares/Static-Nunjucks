// Gulp.js configuration
const
  // modules
  gulp            = require('gulp'),
  replace         = require('gulp-replace'),

  // replacement settings
  exampleSetting     = process.env.THE_SETTING || 'sample-setting';
;

// run replacement for each environment
// this can be used for example to setup different API endpoints for each environment
// 'exampleSetting_replaced_during_build' in this case is a string replaced during build time
module.exports =  {
  set: function (theStream) {
    theStream = theStream
      .pipe(replace('exampleSetting_replaced_during_build', exampleSetting))

    if (process.env.NODE_ENV == 'Development') {
      theStream = theStream
        .pipe(replace('exampleSetting_replaced_during_build', exampleSetting));
    }
    else if (process.env.NODE_ENV == 'Staging') {
      theStream = theStream
        .pipe(replace('exampleSetting_replaced_during_build', exampleSetting));
    }
    else if (process.env.NODE_ENV == 'Production') {
      theStream = theStream
        .pipe(replace('exampleSetting_replaced_during_build', exampleSetting));
      }
    else  {
      theStream = theStream
        .pipe(replace('exampleSetting_replaced_during_build', exampleSetting));
    }
    theStream = theStream.on("data", function() {}); // magic fix for the issue where pages just dont get optimized
  }
}
