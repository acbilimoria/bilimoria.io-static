const path = require( 'path' );
const webpack = require( 'webpack' );
const liveReload = require( 'webpack-livereload-plugin' );

const config = {
	entry: path.resolve( __dirname, '../src/js/index.js' ),
	output: {
		path: path.resolve( __dirname, '../dist/js' ),
		filename: 'build.js',
	},
	module: {
		rules: [
			{
				test: /\.js$/,
				use: {
					loader: 'babel-loader',
					options: {
						presets: [ 'env' ]
					}
				},
			}
		],
	},
	resolve: {
		modules: [
			'node_modules',
			'vendor',
			'assets/src/js',
		]
	},
	externals: {
		jquery: 'jQuery',
		underscore: '_',
	},
	plugins: [],
};

switch ( process.env.NODE_ENV ) {
	case 'production':
		config.plugins.push( new webpack.optimize.UglifyJsPlugin() );
		break;

	default:
		config.devtool = 'cheap-module-eval-source-map';
		config.plugins.push( new liveReload() );
}

module.exports = config;
