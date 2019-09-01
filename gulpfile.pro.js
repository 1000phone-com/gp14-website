const { src, dest, series, parallel, watch } = require('gulp');
const webpackStream = require('webpack-stream')
const sass = require('gulp-sass');
const path = require('path');
const rev = require('gulp-rev')
const revCollector = require('gulp-rev-collector');

// 拷贝html
function copyHtml() {
  return src('src/*.html')
    .pipe(dest("dist/"))
}



function compilejs() {
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
        path: path.resolve(__dirname, './dist/')
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
    .pipe(rev())
    .pipe(dest('./dist/'))
    .pipe(rev.manifest())
    .pipe(dest('./rev/script/'))

}


function compilecss() {
  return src('./src/style/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(rev())
    .pipe(dest('./dist/css/'))
    .pipe(rev.manifest())
    .pipe(dest('./rev/style/'))

}

function createVersion() {
  return src(['rev/*/*.json', 'dist/*.html'])
    .pipe(revCollector())
    .pipe(dest('./dist/'))
}


exports.default = series([parallel([compilecss, compilejs]), copyHtml, createVersion]);