// https://github.com/postcss/postcss-cli#config

'use strict';

module.exports = {
	map: false,
	plugins: {
		'cssnano': {
			discardComments: {
				removeAll: true
			}
		}
	}
};
