var gulp = require('gulp');
var gutil = require('gulp-util');
var concat = require('gulp-concat');
var uglify = require('gulp-uglifyjs');
var minifyCSS = require('gulp-minify-css');
var imagemin = require('gulp-imagemin');
var pngquant = require('imagemin-pngquant');
var htmlprocessor = require('gulp-htmlprocessor');
var rename = require("gulp-rename");
var environments = require('gulp-environments');
var development = environments.development;
var production = environments.production;
var environment = process.env.NODE_ENV;
console.log(environment)


gulp.task('concatjs', function() {
  gulp.src(
    [
      './bower_components/angular/angular.min.js',
      './bower_components/angular-ui-router/release/angular-ui-router.min.js',
      './bower_components/moment/min/moment.min.js',
      './bower_components/angular-moment/angular-moment.js',
      './bower_components/angular-img-cropper/dist/angular-img-cropper.min.js',
      './bower_components/angular-file-upload/dist/angular-file-upload.min.js',
      './bower_components/slick-carousel/slick/slick.js',
      './bower_components/angular-slick/dist/slick.js',
      './bower_components/ngmap/build/scripts/ng-map.min.js',
      './public/js/libraries/bootstrap.min.js',
      './public/js/libraries/canvas-to-blob.min.js',
      './public/js/libraries/datepicker.js',
      './public/js/app.js',
      './public/js/controllers/logIn.js',
      './public/js/controllers/index.js',
      './public/js/controllers/places.js',
      './public/js/controllers/vehicles.js',
      './public/js/controllers/driver.js',
      './public/js/controllers/admins.js',
      './public/js/controllers/dashboard.js',
      './public/js/controllers/promotions.js',
      './public/js/controllers/bar.js',
      './public/js/controllers/payBills.js',
      './public/js/controllers/loans.js',
      './public/js/controllers/data.js',
      './public/js/controllers/users.js',
      './public/js/directives/promotionalModal.js',
      './public/js/directives/servicesSlick.js',
      './public/js/directives/seriousModal.js',
      './public/js/directives/placeHeader.js',
      './public/js/directives/addCard.js',
      './public/js/directives/modal.js'
    ]
  )
  .pipe(concat("lookatManage.min.js"))
  .pipe(uglify({mangle: false}))
  .pipe(gulp.dest("./public/js/dist"));
});


gulp.task('concatcss', function() {
  gulp.src(
    [
      './public/css/bootstrap.min.css',
      './public/css/bootstrap-theme.min.css',
      './public/css/mystyles.css',
      './public/css/photoEdit.css',
      './public/css/promotionals.css',
      './public/css/products.css',
      './public/css/reviews.css',
      './public/css/receipts.css',
      './public/css/payMonth.css',
      './public/css/data.css',
      './public/css/logIn.css',
      './public/css/font-awesome.min.css',
      './public/css/bootstrap-social.css',
      './public/css/map.css',
      './public/css/dashboard.css',
      './bower_components/angularjs-datepicker/src/css/angular-datepicker.css'
    ]
  )
  .pipe(concat("lookatstyles.min.css"))
  .pipe(minifyCSS())
  .pipe(gulp.dest("./public/css"));
});


gulp.task('processhtml', function() {
  gulp.src('./views/auxIndex.ejs')
  .pipe(htmlprocessor({environment: environment}))
  .pipe(rename("index.ejs"))
  .pipe(gulp.dest("./views",{overwrite: false}));
});


gulp.task('build', ['concatjs', 'concatcss', 'processhtml']);
