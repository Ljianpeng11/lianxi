var gulp = require("gulp");
var gutil = require('gulp-util');
var greplace = require('gulp-replace');
var concat = require('gulp-concat')
var webpack = require("webpack");
var webpackConfig = require("./webpack.config.js");
var webpackConfigDev = require("./webpack.config.dev.js");
var WebpackDevServer = require("webpack-dev-server");
var path = require("path");
var fs = require("fs");
var version = '1.0.0';
var bump = require("gulp-bump");
var runSequence = require("run-sequence").use(gulp);
var copy = require("gulp-copy");
var zip = require("gulp-zip");
var rimraf = require("rimraf");
var git = require('gulp-git');
var serverIP = '139.159.246.230:9000';

var gqApplicationName = '高青县城市排水防汛应急指挥系统';
var hwApplicationName = '中工水务在线监测系统';
var gqServerURL = 'http://139.159.246.230:32904';
var hwServerURL = 'http://139.159.246.230:33104';

/**
 * 合并lib文件
 */
gulp.task('concat-lib', function () {
    gulp.src(['vue/dist/vue.min.js'], {
        cwd: '../lib'
    }).pipe(concat('vue.min.js')).pipe(gulp.dest('../release/lib'));

    gulp.src(['jquery/dist/jquery.min.js'], {
        cwd: '../lib'
    }).pipe(concat('jquery.min.js')).pipe(gulp.dest('../release/lib'));

    gulp.src(['bootstrap/dist/js/bootstrap.min.js'], {
        cwd: '../lib'
    }).pipe(concat('bootstrap.min.js')).pipe(gulp.dest('../release/lib'));

    gulp.src(['bootstrap/dist/css/bootstrap.min.css'], {
        cwd: '../lib'
    }).pipe(concat('bootstrap.min.css')).pipe(gulp.dest('../release/lib'));
})

/**
 * 使用测试配置打包，启动hot dev server
 */
gulp.task('webpack-dev', ['concat-lib'], function () {
    var config = Object.create(webpackConfigDev);
    //这两项配置原本是在webpack.config.dev.js里边配置，可是通过gulp启动devserver，那种配置无效，只能在此处写入
    //官网的解释是webpack-dev-server没有权限读取webpack的配置
    config.entry.app.unshift("webpack-dev-server/client?http://localhost:9000/", "webpack/hot/dev-server");
    config.plugins.push(new webpack.HotModuleReplacementPlugin());
    var compiler = webpack(config);
    var server = new WebpackDevServer(compiler, {
        contentBase: "../",
        publicPath: "/release/",
        hot: true,
        compress: false,
        stats: {colors: true}
    });
    server.listen(9000, "localhost", function () {
    });
    // server.close();
});

/**
 * 使用正式配置打包
 */
gulp.task('webpack-build', ['concat-lib'], function () {
    var config = Object.create(webpackConfig);
   webpack(config, function (err, stats) {
        if (err) {
            throw new gutil.PluginError("webpack", err);
        }
        gutil.log("[webpack]", stats.toString({}));
        var assets = stats.compilation.assets;
        var cssName = '';
        var jsName = '';
        for (var file in assets) {
            if (file.endsWith('css')) {
                cssName = file;
            }
            else if (file.endsWith('bundle.js')) {
                jsName = file;
            }
        }
       gulp.src('../src/index.html')
            .pipe(greplace('../release/', './'))
            .pipe(greplace('../lib/arcgis/4.4/', 'http://' + serverIP + '/lib/arcgis/4.4/'))
            .pipe(greplace('../lib/arcgis/4.4/', 'http://' + serverIP + '/lib/arcgis/4.4/'))
            .pipe(greplace('../vendors', './vendors'))
            .pipe(greplace('<!--build', ''))
            .pipe(greplace('build-->', ''))
            .pipe(greplace('devStart-->', ''))
            .pipe(greplace('<!--devEnd', ''))
            .pipe(greplace('../build/dist/vendor.dll.js', ''))
            .pipe(greplace('./css/main.css', cssName))
            .pipe(greplace('app.bundle.js', jsName))
            .pipe(gulp.dest('../release'));
    });
});
gulp.task('replace-setting', function () {
    gulp.src('../release/**/**')
        .pipe(greplace(gqServerURL, hwServerURL))
        .pipe(greplace(gqApplicationName, hwApplicationName))
        .pipe(gulp.dest('../release'));
});
gulp.task('copy-vendors', function () {
    gulp.src('../3rd/**/**').pipe(gulp.dest('../release/3rd'));
    gulp.src('../vendors/**/**').pipe(gulp.dest('../release/vendors'));
    gulp.src('../lib/**/**').pipe(greplace('localhost:9000', serverIP)).pipe(gulp.dest('../release/lib'));
    gulp.src('../src/img/**/**').pipe(gulp.dest('../release/img'));
    gulp.src('../src/css/**/**').pipe(gulp.dest('../release/css'));
    gulp.src('../build/dist/vendor.dll.js').pipe(gulp.dest('../release'));
    gulp.src('../src/css/login.css').pipe(gulp.dest('../release/css'));
    gulp.src('../startCDN.bat').pipe(gulp.dest('../release'));
});
gulp.task('upload-source', function () {
    //TODO
    //1.上传刚刚生成的文件到CDN or 线上环境静态服务器
    //2.正则匹配index.html，替换js文件路径为CDN路径，将index.html写入release
    // 此工作可尝试用webpack插件https://github.com/ampedandwired/html-webpack-plugin完成
    gulp.src('../src/index.html')
    //.pipe(greplace(/xxxxx/g,"xxxxx"))
        .pipe(gulp.dest('../release'));
});
gulp.task("bump-version", function () {
    return gulp.src(['../package.json']).pipe(bump({type: "path"}).on('error', gutil.log)).pipe(gulp.dest('../'));
});
gulp.task('copy:dist', function () {
    version = getPackageJsonVersion();
    var steam = gulp.src(['../release/*', '../package.json']).pipe(copy('../publish/' + version + '/', {
        prefix: 2
    })).on('error', function (error) {
        console.log(error);
    });
    return steam;
});
function getPackageJsonVersion() {
    return JSON.parse(fs.readFileSync('../package.json', 'utf8')).version;
};
gulp.task('gitPush', function (cb) {
    git.push('origin', 'master', {args: '--tags'}, cb);
});
gulp.task('tag', function (cb) {
    version = getPackageJsonVersion();
    git.tag(version, 'Created tag for version: ' + version, function () {
        git.push('origin', 'master', {args: '--tags'}, cb);
    });
});
gulp.task('push-version-file', function (cb) {
    version = getPackageJsonVersion();
    return gulp.src('../package.json', {buffer: false}).pipe(git.add()).pipe(git.commit('Upgrade the version to ' + version));
});
gulp.task('clean', function (cb) {
    rimraf('../release', cb);
});
gulp.task('ZIP', function () {
    return gulp.src(['../package.json', '../release/**/*']).pipe(zip('../publish/vue-test-' + version + '.zip')).pipe(gulp.dest('C:/publish/'));
})
gulp.task("default", ["webpack-dev"]);
gulp.task("build", ["clean"], function () {
    runSequence("copy-vendors", "webpack-build");
});
gulp.task("release", ["clean", "bump-version"], function () {
    runSequence("webpack-build", "upload-source", "push-version-file", "gitPush", "tag", "ZIP");
});
