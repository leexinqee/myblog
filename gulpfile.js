var gulp = require('gulp'),
	less = require("gulp-less");

gulp.task('index', function() {
	return gulp.src("public/less/index.less")
			.pipe(less())
			.pipe(gulp.dest("public/css"))
});

gulp.task('animate', function() {
	return gulp.src("public/less/animate.less")
		.pipe(less())
		.pipe(gulp.dest("public/css"))
});

gulp.task('testlesswatch', function () {
    gulp.watch('less/index.less', ['testless']); //当所有less文件发生改变时，调用testLess任务
});



