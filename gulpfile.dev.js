const { src, dest, series, parallel, watch } = require('gulp');
const gulpServer = require('gulp-webserver');
const webpackStream = require('webpack-stream')
const sass = require('gulp-sass');
const path = require('path');
var proxy = require('http-proxy-middleware')
const del = require('del');

// 拷贝html
function copyHtml() {
  return src('src/*.html')
    .pipe(dest("dev/"))
}


function server() {
  return src('dev')
    .pipe(gulpServer({
      port: 8000,
      open: true,
      //directoryListing: true,
      livereload: true,
      middleware: [
        proxy('/api', {
          target: 'https://m.lagou.com',
          //target: 'http://www.easy-mock.com/mock/5d69ca70fe6deb2209936e60/m-website/',
          changeOrigin: true, // 访问不同的域名，需要配置成 true
          pathRewrite: {
            '^/api': ''
          }
        }),
        proxy('/json', {
          target: 'http://localhost:8888',
          pathRewrite: {
            '^/json': '/json'
          }
        })
      ]
    }))
}

function compilejs() {
  console.log('compile js')
  return src(['./src/js/*.js', './src/js/*/*.js'])
    .pipe(webpackStream({
      mode: 'development',
      entry: {
        app: './src/js/app.js',
        "app-search": './src/js/app-search.js',
        "app-profile": './src/js/app-profile.js'
      },
      output: {
        filename: '[name].js',
        path: path.resolve(__dirname, './dev/')
      },
      module: {
        rules: [
          {
            test: /\.js$/,
            exclude: /node_modules/,
            use: {
              loader: 'babel-loader',
              options: {
                presets: ['@babel/preset-env'],
                plugins: ['@babel/transform-runtime']
              }
            }
          },
          {
            test: /\.html$/,
            loader: 'string-loader'
          }
        ]
      }

    }))
    .pipe(dest('./dev/'))


}


function compilecss() {
  return src('./src/style/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(dest('./dev/css/'))

}

function clear(path) {
  return function () {
    return del(path);
  }
}

function watchfill() {
  watch('./src/style/*.scss', compilecss);
  watch('./src/*.html', series[compilejs, copyHtml]);
  watch('./src/js/view/*.html', series(clear('./dev/js/app.js'), compilejs))
  watch(['./src/**/*.js', './src/js/**/*.js'], compilejs);
}

function copyFonts() {
  return src(['src/style/*.ttf', 'src/style/*.woff'])
    .pipe(dest("dev/css/"))
}

function copyLibs() {
  return src(['src/js/libs/*.js'])
    .pipe(dest("dev/js/lib/"))
}

function copyImages() {
  return src(['src/images/**.*'])
    .pipe(dest("dev/images/"))
}


exports.default = series([parallel([compilecss, copyLibs, compilejs, copyFonts, copyImages]), copyHtml, server, watchfill]);