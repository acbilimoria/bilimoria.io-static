'use strict';

import $ from 'jquery';
import 'jquery.easing';
import _ from 'underscore';
import 'bootstrap/js/src/carousel';
import 'bootstrap/js/src/collapse';
import 'bootstrap/js/src/tab';
import 'bootstrap/js/src/modal';
import 'slick-carousel';
import { initUrgencyCounters } from './urgency-counter';
import { initTouchDropdown } from './touch-dropdown';
import 'proteusthemes/sticky-menu/assets/js/sticky-menu';
import NumberCounter from 'proteusthemes/proteuswidgets/assets/js/NumberCounter';
import ThemeSlider from './theme-slider/theme-slider';
import VimeoEvents from './theme-slider/vimeo-events';
import YoutubeEvents from './theme-slider/youtube-events';

$( () => {
	// Footer widgets fix
	$( '.col-lg-__col-num__' )
		.removeClass( 'col-lg-__col-num__' )
		.addClass( 'col-lg-3' );


	// Number Counter Widget JS code
	const $counterWidgets = $( '.number-counters' ); // Get all number counter widgets
	if ( $counterWidgets.length ) {
		$counterWidgets.each( function () {
			new NumberCounter( $( this ) );
		} );
	}


	// Slick carousel for the Person profile widget (from the PW composer package).
	$( '.js-person-profile-initialize-carousel' ).slick();


	// Animate the scroll, when back to top is clicked
	$( '.js-back-to-top' ).click( ( ev ) => {
		ev.preventDefault();

		$( 'body, html' ).animate( {
			scrollTop: 0
		}, 700 );
	} );


	// Add path markup in growth icons.
	$( 'i.gp, span.gp' ).each( ( i, el ) => {
		for ( let pathNumber = 1, $el = $( el ); pathNumber < 38; pathNumber++ ) {
			$el.append( '<span class="path' + pathNumber + '"></span>' );
		}
	} );


	/**
	 * Slick Carousel - Theme Slider
	 */
	let $sliderEl = $( '.js-pt-slick-carousel-initialize-slides' );
	if ( $sliderEl.length ) {
		const themeSliderInstance = new ThemeSlider( $sliderEl );
		new VimeoEvents( themeSliderInstance );

		// Load the YT events only, if there are items on the page that need it.
		// (theme slider with YT video or person profile with YT video).
		if ( $( '.js-carousel-item-yt-video-link' ).length || $( '.js-carousel-item-yt-video' ).length ) {
			new YoutubeEvents( themeSliderInstance );
		}
	}


	/**
	 * Urgency counter JS code.
	 */
	initUrgencyCounters();


	/**
	 * Touch Dropdown init.
	 */
	initTouchDropdown();
} );
