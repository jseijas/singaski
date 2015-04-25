(function () {
  'use strict';

  /* Requires */
  var gulp                = require('gulp'),
      connect             = require('gulp-connect'),
      shell               = require('gulp-shell'),
      historyApiFallback  = require('connect-history-api-fallback');

  var devport = 9082;

  /* TASKS */
  gulp.task('devserver', function() {
    connect.server({
      root: [__dirname],
      hostname: '0.0.0.0',
      port: devport,
      livereload: true,
      middleware: function(connect, opt) {
        return [ historyApiFallback ];
      }
    });
  });

  gulp.task('default', ['devserver']);

})();