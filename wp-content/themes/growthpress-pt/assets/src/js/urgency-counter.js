'use strict';

import $ from 'jquery';
import { storageAvailable } from './utils';

const initUrgencyCounters = () => {
	$( '.js-pt-urgency-countdown-widget' ).each( ( index, element ) => {
		const minutes = $( element ).data( 'minutes' );
		const seconds = $( element ).data( 'seconds' );
		const id      = $( element ).data( 'id' );

		// Check if local session storage is enabled.
		const localStorageEnabled = storageAvailable( 'sessionStorage' );

		let totalMilliseconds = ( (minutes * 60) + seconds ) * 1000;

		if ( localStorageEnabled ) {
			totalMilliseconds = sessionStorage.getItem( 'pt-uc-tms-' + id ) || totalMilliseconds;
			totalMilliseconds = parseInt( totalMilliseconds, 10 );
		}

		// Update the count down every 1 second.
		let urgencyCounter = setInterval( function() {

			// Calculate the remaining minutes and seconds.
			const m = Math.floor( ( totalMilliseconds % (1000 * 60 * 60)) / (1000 * 60) );
			const s = Math.floor( ( totalMilliseconds % (1000 * 60)) / 1000 );

			// Display the result in the element.
			$( element ).html( m + ' minutes ' + s + ' seconds' );

			// If the count down is finished.
			if ( totalMilliseconds <= 0 ) {
				clearInterval( urgencyCounter );

				$( element ).html( '0 minutes 0 seconds' );
			}
			else {
				totalMilliseconds = totalMilliseconds - 1000;

				if ( localStorageEnabled ) {
					sessionStorage.setItem( 'pt-uc-tms-' + id, "" + totalMilliseconds );
				}
			}
		}, 1000 );
	} );
}

export { initUrgencyCounters };
