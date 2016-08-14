var gulp = require("gulp"),
    watch = require("gulp-watch"),
    browserSync = require("browser-sync").create(),
    reload = browserSync.reload,
    webpack = require("webpack"),
    webpackConfig = require("./webpack.config"),
    util = require("gulp-util"),
    spawn = require("child_process").spawn
    // dotnet = spawn('dotnet', ['watch', 'run']),
    semantic_watch = require("./Assets/Semantic/tasks/watch"),
    semantic_build = require("./Assets/Semantic/tasks/build")
;
    
var watch = util.env.watch;
var verbose = util.env.verbose;


gulp.task('watch', ['serve'], function () {
    browserSync.init({});
  //  semantic_watch();
    gulp.watch(["**/*.cshtml", "**/*.dll"]).on('change', reload);
    gulp.watch(["**/*.tsx"], ['rebuild']);
    gulp.watch(["wwwroot/semantic/**/*.css", "wwwroot/semantic/**/*.js"]).on('change', reload);
});

gulp.task('rebuild', function () {
    webpack(
        webpackConfig,
        function (err, stats) {
            if (err)
                console.log(err);
            browserSync.reload();
        });
    
});

gulp.task('serve', function () {
   dotnetRun();
});

gulp.task('build', 'Builds all files from source', semantic_build);

gulp.task('default', false, ['watch']);

function dotnetRun() {
    let dotnet = spawn('dotnet', ['watch', 'run'])
    dotnet.stdout.on('data', (data) => {
        if (verbose)
            console.log(data.toString('utf8'));
    });

    dotnet.stderr.on('data', (data) => {
        console.log(data.toString('utf8'));
    });

    dotnet.on('exit', (code) => {
        console.log(`dotnet exited with code ${code}`);
    });
};