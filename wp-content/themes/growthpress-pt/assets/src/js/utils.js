'use strict';

import $ from 'jquery';

/**
 * Returns true if at least one part of the element is in viewport
 */
const isElementInView = ( $elm ) => {
	const $window = $( window ),
		docViewTop = $window.scrollTop(),
		docViewBottom = docViewTop + $window.height(),
		elemTop = $elm.offset().top,
		elemBottom = elemTop + $elm.height();

	return ( ( elemBottom > docViewTop ) && ( elemTop < docViewBottom ) );
}


/**
 * Feature detection helper function for Web Storage API.
 *
 * @param   string type The type of web storage ('localStorage' or 'sessionStorage')
 * @returns boolean
 */
const storageAvailable = ( type ) => {
	try {
		let storage = window[ type ],
			x = '__storage_test__';

		storage.setItem( x, x );
		storage.removeItem( x );

		return true;
	}
	catch( e ) {
		return false;
	}
}

export { isElementInView, storageAvailable };
