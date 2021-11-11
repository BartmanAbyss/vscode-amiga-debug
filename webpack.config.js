const path = require('path');
const webpack = require('webpack');
const TerserPlugin = require('terser-webpack-plugin');

module.exports = (env, argv) => {
	var config = {
		entry: "./src/client/client.ts",
		output: {
			filename: "client.bundle.js",
			chunkFilename: "client.bundle.[id].js",
			clean: true
		},
		devtool: (argv.mode === 'development') ? 'inline-source-map' : undefined,
		resolve: {
			extensions: [".webpack.js", ".web.js", ".ts", ".tsx", ".js"],
			alias: {
				"react": "preact/compat",
				"react-dom": "preact/compat",
			},
			fallback: {
				path: require.resolve('path-browserify')
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
		plugins: [
			new webpack.optimize.LimitChunkCountPlugin({
				maxChunks: 1
			})
		],
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
		devServer: {
			open: true,
			contentBase: path.join(__dirname, 'src/test/suite/data/output/')
		}
	};

	return config;
};