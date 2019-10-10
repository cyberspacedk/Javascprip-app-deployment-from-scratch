const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
 

module.exports = { 
	context: path.join(__dirname, 'src'),
	entry: './index.js',
	output: {
		path: path.join(__dirname, 'dist'),
		filename: 'app.bundle.js'
	}, 
	module: {
		rules: [
			{
				test: /\.js|\.jsx$/, 
				loader: 'babel-loader',
				exclude: /node_modules/,
				options: {
					presets: ['@babel/preset-env', '@babel/preset-react']
				}
			}
		]
	},
	plugins: [new HtmlWebpackPlugin({
		template: './index.html'
	})]
}