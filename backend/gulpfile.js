const gulp = require('gulp');
const rsync = require('gulp-rsync');


gulp.task('rsync', function() {
  gulp.src('../')
    .pipe(rsync({
      root: '../',
      hostname: 's2t',
      destination: 'speech-to-text/app',
      recursive: true,
      incremental: true,
      progress: true,
      exclude: ['.DS_Store', 'backend/static/js/*.js.map', 'backend/static/css/*.css.map', 'backend/uploads/*', 'backend/downloads/*', 'backend/node_modules', 'frontend/node_modules']
    }));
});