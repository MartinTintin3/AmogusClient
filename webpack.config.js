const path = require('path');

module.exports = {
	entry: './src/index.jsx',
	mode: 'production',
	module: {
		rules: [{
			test: /\.jsx?$/,
			loader: 'babel-loader',
			exclude: [/node_modules/, /app/],
		}],
	},
	resolve: {
		extensions: ['.js', 'jsx'],
	},
	output: {
		path: path.resolve(__dirname, 'app/js'),
		filename: 'build.js',
	},
};