var gulp = require("gulp");
var nodemon = require("gulp-nodemon");
var ts = require("gulp-typescript");
var tsProject = ts.createProject("tsconfig.json");

gulp.task("build", function () {
    return tsProject.src().pipe(tsProject()).js.pipe(gulp.dest("dist"));
})

gulp.task("serve", function(done){
    nodemon({
        script: 'dist/server.js',
        ext: 'ts js',
        ignore: ['dist/**/*'],
        tasks: ['build'],
        done: done
    })
})