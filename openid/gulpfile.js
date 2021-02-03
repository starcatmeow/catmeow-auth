var gulp = require("gulp");
var nodemon = require("gulp-nodemon");
var ts = require("gulp-typescript");
var tsProject = ts.createProject("tsconfig.json");

gulp.task("build", function () {
    return tsProject.src().pipe(tsProject()).js.pipe(gulp.dest("dist"));
})

gulp.task("copyejs", function() {
    return gulp.src('./src/view/*.ejs').pipe(gulp.dest('./dist/view'))
})

gulp.task("serve", function(done){
    nodemon({
        script: 'dist/server.js',
        ext: 'ts js ejs',
        ignore: ['dist/**/*'],
        tasks: ['build','copyejs'],
        done: done
    })
})