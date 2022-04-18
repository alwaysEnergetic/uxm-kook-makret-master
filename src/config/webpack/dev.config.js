var path = require("path");
var webpack = require("webpack");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CopyPlugin = require("copy-webpack-plugin");
var HtmlWebpackPlugin = require("html-webpack-plugin");
// const FixStyleOnlyEntriesPlugin = require("webpack-fix-style-only-entries");

const env = process.env.NODE_ENV || "development";

const WebpackManager = require("@kookjs-client/webpack")
const wm = new WebpackManager({
	env: env
})
let APP_CONFIG = (wm.getAppConfig())
let mode = (wm.getWebpackMode())
const BUILD_DIR = wm.config.buildDir;
const ROOT_DIR = wm.config.rootDir;
console.log(APP_CONFIG);

const recaptchaSiteKey = JSON.parse(APP_CONFIG.recaptchaSiteKey);

var config = {
	mode: mode,

	devServer: {
    contentBase: BUILD_DIR,
    compress: true,
		port: 2201,
		historyApiFallback: true,
		host: "0.0.0.0",

		hot: false,
    inline: false,
    liveReload: false

  },
	
	// Enable sourcemaps for debugging webpack's output.
	devtool: "eval-cheap-module-source-map",

	resolve: {
		extensions: [".ts", ".tsx", ".js"],
	},

	externals: {
		jquery: 'jQuery',
		toastr: 'toastr'
	},
	
	entry: {
		lib: path.resolve(ROOT_DIR, "src/assets/scss/lib.module.scss"),
		main: path.resolve(ROOT_DIR, "src/index.tsx"),
	},

	output: {
		path: `${BUILD_DIR}`,
		publicPath: "/",
		filename: "[name].js",
		chunkFilename: '[name].bundle.js',
	},

	optimization: {
		runtimeChunk: "single",
		// runtimeChunk: false,
		minimize: wm.isProduction(),
		// splitChunks: {
		// 	cacheGroups: {
		// 		vendor: {
		// 			test: path.resolve(ROOT_DIR, "node_modules/"),
		// 			chunks: "initial",
		// 			name: "vendor",
		// 			priority: -10,
		// 			enforce: true,
		// 			reuseExistingChunk: true,
		// 		},

		// 		default: {
    //       minChunks: 2,
    //       priority: -20,
    //       reuseExistingChunk: true,
    //     },
		// 	},
		// },
	},

	module: {
		rules: [
			{
				test: /\.ts(x?)$/,
				exclude: /node_modules/,
				use: [
					{
						loader: "ts-loader",
						options: {
							onlyCompileBundledFiles: true,
							// transpileOnly: true,
						},
					},
				],
			},

			// All output '.js' files will have any sourcemaps re-processed by 'source-map-loader'.
			// {
			// 	enforce: "pre",
			// 	test: /\.js$/,
			// 	loader: "source-map-loader",
			// },

			{
				test: /\.(js)$/,
				exclude: /node_modules/, // add this line
				use: {
					loader: "babel-loader",
				},
			},

			{
				test: /\.(jpg|jpeg|png|gif)$/,
				use: "url-loader?limit=1000",
			},

			{
				test: /\.(woff|woff2|eot|otf|ttf|svg)$/,
				use: "file-loader",
			},

			{
				test: /\.(less|scss|css)$/,
				use: [
					MiniCssExtractPlugin.loader,
					{
						loader: "css-loader",
						options: {
							importLoaders: 1,
							modules: false,
						},
					},

					{
						loader: "postcss-loader",
						options: {
							postcssOptions: {
								// path: path.resolve(__dirname, "postcss.config.js"),
								plugins: [
									require("autoprefixer"),
								]
							},
							sourceMap: true,
						},
					},

					"sass-loader",
					// "less-loader",
				],
			},
		],
	},

	plugins: [
		new CopyPlugin({
			patterns: [
				{
					from: `${ROOT_DIR}/src/assets/js`,
					to: `${BUILD_DIR}/assets/js`,
				},
				{
					from: `${ROOT_DIR}/src/assets/css`,
					to: `${BUILD_DIR}/assets/css`,
				},
				{
					from: `${ROOT_DIR}/src/assets/images`,
					to: `${BUILD_DIR}/images`,
				},
			],
		}),

		// new FixStyleOnlyEntriesPlugin(),

		new MiniCssExtractPlugin({
			filename: "[name].css",
			chunkFilename: "[name].css",
		}),

		new webpack.DefinePlugin({
			APP_CONFIG,
		}),

		new HtmlWebpackPlugin({
			hash: true,

			minify: wm.isProduction()
				? {
						collapseWhitespace: true,
						removeComments: true,
						removeRedundantAttributes: true,
						removeScriptTypeAttributes: true,
						removeStyleLinkTypeAttributes: true,
						useShortDoctype: true,
				  }
				: false,
			title: JSON.parse(APP_CONFIG.siteTitle),
			
			template: "index.html",
			meta: {
				viewport: "width=device-width, initial-scale=1, shrink-to-fit=no",
				description: "",
			},

			logoUrl: JSON.parse(APP_CONFIG.domain) + JSON.parse(APP_CONFIG.logoUrl),

			gtmContainerId: JSON.parse(APP_CONFIG.gtmContainerId),

			styles: [
				"https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,100;0,300;0,400;0,500;0,700;0,900;1,100;1,300;1,400&display=swap", 
				"/assets/css/toastr.min.css",
				'https://cdn.jsdelivr.net/gh/fancyapps/fancybox@3.5.7/dist/jquery.fancybox.min.css'
			],

			scripts: [
				"/assets/js/jquery.min.js",
				"/assets/js/toastr.min.js",
				"/assets/js/popper.min.js",
				"/assets/js/bootstrap.min.js",
				recaptchaSiteKey ? `https://www.google.com/recaptcha/api.js?render=${recaptchaSiteKey}` : "",
				
				'https://cdn.jsdelivr.net/gh/fancyapps/fancybox@3.5.7/dist/jquery.fancybox.min.js'
			],
		}),
	],
};

module.exports = [config];
