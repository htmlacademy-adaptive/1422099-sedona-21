const gulp = require("gulp");
const plumber = require("gulp-plumber");
const sourcemap = require("gulp-sourcemaps");
const sass = require("gulp-sass");
const postcss = require("gulp-postcss");
const autoprefixer = require("autoprefixer");
const csso = require("postcss-csso");
const rename = require("gulp-rename");
const htmlmin = require("gulp-htmlmin");
const imagemin = require("gulp-imagemin");
const webp = require("gulp-webp");
// const svgstore = require("gulp-svgstore");
const del = require("del");
const sync = require("browser-sync").create();
// const uglify = require("gulp-uglify-es");


// minHTML

const html = () => {
  return gulp.src("source/*.html")
  .pipe(htmlmin({collapseWhitespace: true}))
  .pipe(gulp.dest("build"))
}

exports.htmlmin = html;

// scripts

// const scripts = () => {
//   return gulp.src("source/js/script.js")
//   .pipe(uglify())
//   .pipe(rename("script.min.js"))
//   .pipe(gulp.dest("build/js"))
//   .pipe(sync.stream());
// }

// exports.scripts = scripts;

// imagemin

const images = () => {
  return gulp.src("source/img/*.{jpg,png,svg}")
  .pipe(imagemin([
  imagemin.optipng({optimizationLevel: 3}),
  imagemin.mozjpeg({progressive: true}),
  imagemin.svgo()
  ]))
 .pipe(gulp.dest("build/img"))
}

exports.images = images;

// createWebp

const createWebp = () => {
  return gulp.src("source/img/*.{jpg,png}")
  .pipe(webp({quality: 90}))
  .pipe(gulp.dest("build/img"))
}

exports.createWebp = createWebp;

// svgSprite

// const sprite = () => {
//   return gulp.src("source/img/*.svg")
//   .pipe(svgstore())
//   .pipe(rename("sprite.svg"))
//   .pipe(gulp.dest("build/img"));
// }

// exports.sprite = sprite;

// copy

const copy = () => {
  return gulp.src([
    "source/fonts/*.{woff2,woff}",
    "source/*.ico",
    "source/img/**/*.{jpg,png,svg}",
    "source/css/style.min.css"
    ],
    {
    base: "source"
    })
    .pipe(gulp.dest("build"))
}

exports.copy = copy;

//  clean

const clean = () => {
  return del("build")
}

exports.clean = clean;

// Styles

const styles = () => {
  return gulp.src("source/sass/style.scss")
    .pipe(plumber())
    .pipe(sourcemap.init())
    .pipe(sass())
    .pipe(postcss([
      autoprefixer(),
      csso()
    ]))
    .pipe(sourcemap.write("."))
    .pipe(rename("style.min.css"))
    .pipe(gulp.dest("source/css"))
    .pipe(sync.stream());
}

exports.styles = styles;

// Server

const server = (done) => {
  sync.init({
    server: {
      baseDir: 'build'
    },
    cors: true,
    notify: false,
    ui: false,
  });
  done();
}

exports.server = server;

// Watcher

const watcher = () => {
  gulp.watch("source/sass/**/*.scss", gulp.series("styles"));
  gulp.watch("source/*.html", gulp.series(html, sync.reload));
}

// build

const build = gulp.series (
  clean,
  gulp.parallel (
  styles,
  html,
  // sprite,
  copy,
  images,
  createWebp
  )
)

exports.build = build;

exports.default = gulp.series(
  clean,
  gulp.parallel (
    styles,
    html,
    // sprite,
    copy,
    createWebp
    ),
    gulp.series (
      server,
      watcher
  )
);

