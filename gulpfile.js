const gulp = require("gulp");
const plumber = require("gulp-plumber");
const sourcemap = require("gulp-sourcemaps");
const sass = require("gulp-sass");
const postcss = require("gulp-postcss");
const csso = require("postcss-csso");
const rename = require("rename");
const imagemin = require("gulp-imagemin");
const del = require("gulp-del");
const uglify = require("gulp-uglify-es");
const webp = require("gulp-webp");
const svgstore = require("gulp-svgstore");
const htmlmin = require("gulp-htmlmin");
const autoprefixer = require("autoprefixer");
const sync = require("browser-sync").create();

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
    .pipe(gulp.dest("build/css"))
    .pipe(sync.stream());
}

exports.styles = styles;

// HTML
const html = () => {
  return gulp.src("source/*.html")
  .pipe(htmlmin({collapseWhitespace: true}))
  .pipe(gulp.dest("build"))
}

exports.html = html;

// Images

const images = () => {
  return gulp.src("source/img/*.{jpg,png,svg}")
  .pipe(imagemin(plugins [
  imagemin.mozjpeg({progressive: true}),
  imagemin.optipng({optimizationLevel: 3}),
  imagemin.svgo()
  ]))
  .pipe(gulp.dest("build/img"))
}

exports.images = images;


// WebP
const createWebp = () => {
  return gulp.src("source/img/*.{jpg,png}")
  .pipe(webp({quality: 90}))
  .pipe(gulp.dest("build/img"))
}

exports.createWebp = createWebp;

// sprite
const sprite = () => {
  return gulp.src("source/img/*.svg")
  .pipe(rename("sprite.svg"))
  .pipe(svgstore())
  .pipe(gulp.dest("build/img"))
}

exports.sprite = sprite;

// copy
const copy = () => {
  return gulp.src([
    "source/fonts/*.{woff2,woff}",
    "source/*ico",
    "source/img/**/*.{jpg,png,svg}"
  ],
  {
    base: "source"
  })
  .pipe(gulp.dest("build"))
}

exports.copy = copy;

// del

const del = () => {
  return gulp.src([
    "build"
  ],
  {
    base: "source"
  })
  .pipe(gulp.dest("build"))
}

exports.del = del;

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

exports.default = gulp.series(
  styles, server, watcher
);

// Build

const build = gulp.series(
  clean,
  gulp.parallel (
  styles,
  html,
  sprite,
  copy,
  images,
  createWebp
  ),
  gulp.series(
    server,
    watcher
  )
)


exports.build = build;

exports.default =  gulp.series(
  clean,
  gulp.parallel (
    styles,
    html,
    sprite,
    copy,
    createWebp
),
gulp.series(
  server,
  watcher
)
)
