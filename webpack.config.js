const path = require('path');

module.exports = {
	mode: 'development',
	devtool: 'eval-cheap-module-source-map',
	entry: "./src/client/client.tsx",
	output: {
		filename: "client.bundle.js",
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
			}
		],
	},
};