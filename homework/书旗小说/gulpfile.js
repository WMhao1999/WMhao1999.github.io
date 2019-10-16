var {
	gulp,
	src,
	dest,
	watch,
	series
} = require('gulp');
var sass = require('gulp-sass');
sass.compiler = require('node-sass');
var browserSync = require('browser-sync').create();
const px2rem = require('gulp-px2rem');


//编译sass
function fnSass() {
	return src('./sass/*.scss')
		.pipe(sass().on('error', sass.logError))
		.pipe(dest('./css/'));
}
//监听sass
function fnWatchSass() {
	//开启一次服务器
	fnBrowser();
	watch('./sass/*.scss', series(fnSass, fnPx2rem));
	//监听html、css文件，手动重载
	watch(['*.html', './css/*.css', './style/*.css']).on('change', browserSync.reload);
}

var option = {
	rootValue: 64, //根字体大小
	unitPrecision: 5, //小数点后几位
	propertyBlackList: [], //黑名单-不需要编译的属性
	propertyWhiteList: [], //白名单-需要编译的-一般为空
	replace: true, //是否替换原有属性
	mediaQuery: false, //是否把媒体查询中的转为rem   - 一般为否
	minPx: 1 //小于1像素的 不转为rem
}

//把px转为rem
function fnPx2rem() {
	return src('./css/*.css')
		.pipe(px2rem(option))
		.pipe(dest('./style/'));
}
//开启服务器
function fnBrowser() {
	browserSync.init({
		server: {
			baseDir: "./"
		}
	});
}


exports.sass = fnWatchSass;


/*
	sass
		node-sass gulp-sass
			https://www.npmjs.com/package/gulp-sass
	browser-sync
		cnpm i browser-sync --D
			http://browsersync.cn/docs/gulp/
	px2rem
		把px转成rem
			https://www.npmjs.com/package/gulp-px2rem
	
	流程：sass -> css(px) -> css(rem) -> browser-sync


	如何知道是否成功：
		看目录中有没有 node_modules 的文件夹
	一些问题：
		cnpm 以后 长时间没动  就重新来一次（ctrl+c 停止 再重来）

	如果gulpfile.js改变了，如果有监听的话，需要重新执行监听。


	npm/cnpm i gulp --D
 */