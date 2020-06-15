const path = require('path');
const webpack = require('webpack');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const { pathToFileURL } = require('url');

var config = {
	entry: "./src/client/client.tsx",
	output: {
		filename: "client.bundle.js",
		chunkFilename: "client.bundle.[id].js"
	},
	resolve: {
		extensions: [".webpack.js", ".web.js", ".ts", ".tsx", ".js"],
		alias: {
			"react": "preact/compat",
			"react-dom": "preact/compat",
		}
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
							modules: true,
						},
					}
				],
				include: /\.module\.css$/
			},
			{
				test: /\.css$/,
				use: [
					'style-loader',
					'css-loader'
				],
				exclude: /\.module\.css$/
			},
			{
				test: /\.svg$/,
				loader: 'svg-inline-loader',
			},
			{
			  test: /\.(vert|frag)$/,
			  loader: 'raw-loader',
			},
	  
		],
	},
	plugins: [
		new webpack.optimize.LimitChunkCountPlugin({
			maxChunks: 1
		}),
		new CleanWebpackPlugin(),
	],
	devServer: {
		open: true,
		contentBase: path.join(__dirname, 'src/test/suite/data/output/'),
		writeToDisk: true
	}
};

module.exports = (env, argv) => {
	if (argv.mode === 'development') {
		config.devtool = 'source-map';
		//config.devtool = 'inline-source-map'; // doesn't work with source in HTML
		//config.devtool = 'eval-source-map';
	}

	if (argv.mode === 'production') {
	}

	return config;
};