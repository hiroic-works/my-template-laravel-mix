const mix = require('laravel-mix');
const path = require('path');

require('laravel-mix-ejs')
require('laravel-mix-polyfill');

const appBathAssetsSrcDir = 'resources/assets/';	// resource/assetsの対象ディレクトリ
const appBathViewsSrcDir = 'resources/views/';	// resource/viewsの対象ディレクトリ
const appBathDistDir = 'public/';	// public先のディレクトリ

const sassOptions = {
	outputStyle: 'expanded',
	indentType: 'tab',
	indentWidth: 1,
	includePaths: [`${appBathAssetsSrcDir}sass/`]
}
const polyfillOptions = {
	enabled: true,
	useBuiltIns: "usage",
	targets: {"ie": 11}
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

//****************************
// 拡張
//****************************
mix
	// sass
	.sass(`${appBathAssetsSrcDir}sass/app.scss`, 'css', { sassOptions: sassOptions })
	// js
	.js(`${appBathAssetsSrcDir}js/app.js`, 'js')
	.vue()
	.polyfill(polyfillOptions)
	// sourceMaps
	.sourceMaps(false, 'source-map')
	// ejs
	.ejs(`${appBathViewsSrcDir}**/*.ejs`, appBathDistDir, data, {
		partials: `${appBathViewsSrcDir}components`,
		base: 'views'
	})
	// images
	.copyDirectory(`${appBathAssetsSrcDir}images`, `${appBathDistDir}images`)
	// set public path
	.setPublicPath('public')
	// set options
	.options({
		postCss: [
			require('css-mqpacker'),
			require('autoprefixer')
		],
		processCssUrls: false
	})
	// browserSync
	.browserSync({
		proxy: false,
		port:'3000',
		open: 'external',
		server: {
			baseDir: appBathDistDir
		},
		files: [
			`${appBathDistDir}**/*`
		],
	})
	// custoom config
	.webpackConfig({
		plugins: [
		],
		resolve: {
			extensions: ['.js', '.vue', '.json', '.scss'],	// 拡張子省略
			alias: {
				'@': `${__dirname}/${appBathAssetsSrcDir}js`,	// jsのpathエイリアス
				'_@': `${__dirname}/${appBathAssetsSrcDir}sass`,	// sassのpathエイリアス
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