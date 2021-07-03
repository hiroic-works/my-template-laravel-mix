const mix = require('laravel-mix');
const glob = require('glob');
const path = require('path');

require('laravel-mix-ejs')
require('laravel-mix-polyfill');

const appBathAssetsSrcDir = 'resources/assets/';	// resource/assetsの対象ディレクトリ
const appBathViewsSrcDir = 'resources/views/';	// resource/viewsの対象ディレクトリ
const appBathDistDir = 'public/';	// public先のディレクトリ
// globパターン
const globs = {
	sass: glob.sync(`${appBathAssetsSrcDir}sass/**/*.scss`, {ignore: [`${appBathAssetsSrcDir}sass/**/_*.scss`]}),
	js: glob.sync(`${appBathAssetsSrcDir}js/**/*.js`, {ignore: [`${appBathAssetsSrcDir}js/**/_*.js`]}),
}

// EJS
const data = {
	site: {
		fullpath: {
			views: path.resolve(__dirname,appBathViewsSrcDir),
			assets: path.resolve(__dirname,appBathAssetsSrcDir),
			public: path.resolve(__dirname,appBathDistDir)
		},
		isDevelopment: isDevelopment(),
		asset_cache(q = '?') {
			return asset_cache(q)
		}
	}
}

// remove mix-manifest.json
Mix.manifest.refresh = _ => void 0;

mix
	.setPublicPath('public')
	.options({
		postCss: [
			require('css-mqpacker'),
			require('autoprefixer')
		],
		processCssUrls: false
	})
	.browserSync({
		proxy: false,
		port:'3000',
		server: {
			baseDir: 'public'
		},
		files: [
			"public/**/*"
		],
	})
	.polyfill({
		enabled: true,
		useBuiltIns: "usage",
		targets: {"ie": 11}
	});

//****************************
// sass
//****************************
globs.sass.map( (file)=> {
	let parse = getParseFile(file, `${appBathAssetsSrcDir}sass/`);
	mix
		.sass(file, `${appBathDistDir}css/${parse.dir}`,{
			sassOptions: {
				outputStyle: 'expanded',
				indentType: 'tab',
				indentWidth: 1,
				includePaths: [`${appBathAssetsSrcDir}sass/`]
		    }
		})
		.sourceMaps(false, 'source-map');
});

//****************************
// JavaScript
//****************************
globs.js.map((file)=> {
	let parse = getParseFile(file, `${appBathAssetsSrcDir}js/`);
	mix
		.js(file, `${appBathDistDir}js/${parse.dir}`)
		.sourceMaps(false, 'source-map');
});

//****************************
// ejs
//****************************
mix.ejs(`${appBathViewsSrcDir}**/*.ejs`, appBathDistDir, data, {
	partials: `${appBathViewsSrcDir}components`,
	base: 'views'
});

//****************************
// images
//****************************
mix.copyDirectory(`${appBathAssetsSrcDir}images`, `${appBathDistDir}images`);

//****************************
// ソースマップ
//****************************
// mix.sourceMaps(false, 'source-map');


//****************************
// 拡張
//****************************
mix.webpackConfig({
	plugins: [
	],
	resolve: {
		extensions: ['.js', '.vue', '.json', '.scss'],	// 拡張子省略
		alias: {
			'vue$': 'vue/dist/vue.esm.js',
			'@': `${__dirname}/resources/assets/js`,	// jsのpathエイリアス
			'_@': `${__dirname}/resources/assets/sass`,	// sassのpathエイリアス
		}
	}
});


/**
 * パースしたファイル情報取得
 *
 * @param      {string}    file    ファイル
 * @param      {string}    regexp  ルート変更用の置換文字列
 * @return     {Object}  パース↓ファイルのオブジェクト
 */
function getParseFile (file,regexp) {

	let reg = new RegExp(regexp);
	let replaceFile = file.replace(reg,'')
	let parse = path.parse(replaceFile);

	parse.cssExt = parse.ext.replace(/\.sass|\.scss/,'.css');

	if(parse.dir.indexOf('/') != -1) {
		parse.cssDir = parse.dir.replace(/\/sass$|\/scss$/,'\/css')
	} else {
		parse.cssDir = parse.dir.replace(/^sass$|^scss$/,'css')
	}
	if(parse.ext === '') {
		parse.imgDir = replaceFile;
	}

	return parse;
}

function isDevelopment() {
	if(process.env.NODE_ENV == "development") {
		return true
	}
	return false
}

function asset_cache(q = '?') {
	let hash = "";
	if (!isDevelopment()) {
		hash = `${q}cache=${new Date().getTime().toString()}`;
	}
	return hash;
}