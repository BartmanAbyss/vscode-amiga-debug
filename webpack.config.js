const path = require('path');
const webpack = require('webpack');
const TerserPlugin = require('terser-webpack-plugin');

module.exports = (env, argv) => {
	var extensionConfig = {
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
							loader: 'ts-loader'
						}
					]
				}
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
		entry: "./src/client/client.ts",
		output: {
			filename: "client.js",
		},
		devtool: (argv.mode === 'development') ? 'inline-source-map' : undefined,
		resolve: {
			extensions: [".webpack.js", ".web.js", ".ts", ".tsx", ".js"],
			alias: {
				"react": "preact/compat",
				"react-dom": "preact/compat",
			}
		},
		performance: {
			maxAssetSize: 1000000,
			maxEntrypointSize: 1000000
		},
		module: {
			rules: [
				{
					test: /\.tsx?$/,
					loader: "ts-loader",
					options: { configFile: 'tsconfig.client.json' },
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
		}
	};

	return [extensionConfig, clientConfig];
};