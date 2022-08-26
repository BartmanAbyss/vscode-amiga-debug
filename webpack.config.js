const path = require('path');
const webpack = require('webpack');
const TerserPlugin = require('terser-webpack-plugin');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const { transform } = require('ts-transform-react-jsx-source')

module.exports = (env, argv) => {
	var commonConfig = {
		plugins: [
			new ForkTsCheckerWebpackPlugin(),
		]
	};

	var extensionConfig = {
		...commonConfig,
		target: 'node',
		entry: {
			extension: './src/extension.ts',
			debugAdapter: { import: './src/debugAdapter.ts', dependOn: 'extension' }
		},
		output: {
			filename: '[name].js',
			libraryTarget: 'commonjs2',
			devtoolModuleFilenameTemplate: '../[resource-path]'
		},
		devtool: (argv.mode === 'development') ? 'inline-source-map' : undefined,
		externals: {
			vscode: 'commonjs vscode'
		},
		resolve: {
			mainFields: ['browser', 'module', 'main'],
			extensions: ['.ts', '.js']
		},
		module: {
			rules: [
				{
					test: /\.ts$/,
					exclude: /node_modules/,
					use: [
						{
							loader: 'ts-loader',
							options: {
								transpileOnly: argv.mode === 'production',
							}
						}
					]
				},
				{
					test: /\.md$/,
					loader: 'raw-loader',
				},
			]
		},
		optimization: {
			minimize: argv.mode !== 'development',
			minimizer: [new TerserPlugin({
				extractComments: false,
				terserOptions: {
					format: {
						comments: false,
					},
				},
			})]
		}
	};

	var clientConfig = {
		...commonConfig,
		entry: "./src/client/client.tsx",
		output: {
			filename: "client.js",
		},
		devtool: (argv.mode === 'development') ? 'inline-source-map' : undefined,
		resolve: {
			extensions: [".webpack.js", ".web.js", ".ts", ".tsx", ".js"],
			alias: {
				"react": "preact/compat",
				"react-dom/test-utils": "preact/test-utils",
				"react-dom": "preact/compat",     // Must be below test-utils
				"react/jsx-runtime": "preact/jsx-runtime"
			}
		},
		performance: {
			maxAssetSize: 1000000,
			maxEntrypointSize: 1000000
		},
		module: {
			rules: [
				{ // get source maps from node_modules
					test: /\.js$/,
					enforce: "pre",
					use: ["source-map-loader"],
				},
				{
					test: /\.tsx?$/,
					loader: "ts-loader",
					options: {
						configFile: 'tsconfig.client.json',
						transpileOnly: argv.mode === 'production',
						//getCustomTransformers() { return argv.mode === 'development' ? { before: [transform()], } : {}; }, // get preact component stack (doesn't print it anywhere, so disabled for now)
					},
				},
				{
					test: /\.css$/,
					use: [
						'style-loader',
						{
							loader: 'css-loader',
							options: {
								importLoaders: 1,
								modules: {
									auto: /\.module\.css$/i,
									localIdentName: (argv.mode === 'development') ? '[folder][name]__[local]' : '[hash:base64]',
								},
								sourceMap: argv.mode === 'development',
							},
						}
					],
				},
				{
					test: /\.svg$/,
					loader: 'svg-inline-loader',
				},
				{
					test: /\.(vert|frag|md)$/,
					loader: 'raw-loader',
				},
			],
		},
		optimization: {
			minimize: argv.mode !== 'development',
			minimizer: [new TerserPlugin({
				extractComments: false,
				terserOptions: {
					format: {
						comments: false,
					},
				},
			})]
		},
		plugins: [
			//new webpack.debug.ProfilingPlugin()
		]
	};

	return [extensionConfig, clientConfig];
};