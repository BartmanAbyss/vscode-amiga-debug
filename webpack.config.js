const webpack = require('webpack');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

var config = {
	entry: "./src/client/client.tsx",
	target: 'electron-renderer',
	output: {
		filename: "client.bundle.js",
		chunkFilename: "client.bundle.[id].js"
	},
	resolve: {
		extensions: [".webpack.js", ".web.js", ".ts", ".tsx", ".js"]
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
    ]
};

module.exports = (env, argv) => {
	if (argv.mode === 'development') {
		config.devtool = 'inline-source-map';
	}

	if (argv.mode === 'production') {
	}

	return config;
};