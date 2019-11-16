/* global GrowthPressSliderCaptions */
'use strict';

import { isElementInView } from '../utils';
import 'slick-carousel';

/**
 * Slick Carousel - Theme Slider
 */

define( [ 'jquery', 'underscore' ], function( $, _ ) {
	var $captions = {
			mainContainer: $( '.js-pt-slick-carousel-captions-container' ),
			container:     $( '.js-pt-slick-carousel-captions' ),
			title:         $( '.js-pt-slick-carousel-captions-title' ),
			text:          $( '.js-pt-slick-carousel-captions-text' ),
		},
		$currentSliderNumber       = $( '.js-pt-slick-carousel-slide-current-number' ),
		transitionClass            = 'is-in-transition';

	var SlickCarousel = function( $slider ) {
		this.$slider          = $slider;
		this.$parentContainer = $slider.parent();

		if ( this.$slider.length ) {
			this.initializeCarousel();
			this.pauseCarouselIfNotVisible();
			this.onSliderChangeEvents();
			this.registerModalEvents();
		}

		return this;
	};

	_.extend( SlickCarousel.prototype, {

		onSliderChangeEvents: function() {
			this.$slider.on( 'beforeChange', _.bind( function( ev, slick, currentSlide, nextSlide ) {
				if ( this.$slider.length && 'object' === typeof GrowthPressSliderCaptions ) {
					this.changeCaptions( slick, nextSlide );
				}
			}, this ) );

			this.$slider.on( 'afterChange', _.bind( function( ev, slick, currentSlide ) {
				if ( this.$slider.length && 'object' === typeof GrowthPressSliderCaptions ) {
					$captions.container.removeClass( transitionClass );
				}

				this.changeNavigationCount( currentSlide );
			}, this ) );

			return this;
		},

		/**
		 * Change the title and the text for the current (new) slider.
		 * Captions for the theme slider - change them in the out-of-bounds element.
		 */
		changeCaptions: function( slick, nextSlide ) {
			$captions.container.addClass( transitionClass );
			$captions.title.toggleClass( 'pt-slick-carousel__content-title--video', GrowthPressSliderCaptions[ nextSlide ].is_video );
			$captions.container.toggleClass( 'pt-slick-carousel__content--video', GrowthPressSliderCaptions[ nextSlide ].is_video );
			$captions.mainContainer.toggleClass( 'pt-slick-carousel__container--video', GrowthPressSliderCaptions[ nextSlide ].is_video );

			setTimeout( function() {
				$captions.title.html( GrowthPressSliderCaptions[ nextSlide ].title );
				$captions.text.html( GrowthPressSliderCaptions[ nextSlide ].text );
			}, slick.options.speed );

			return this;
		},

		/**
		 * Pause carousel, if it's not visible and only if it's set to autoplay.
		 */
		pauseCarouselIfNotVisible: function() {
			$( document ).on( 'scroll', _.bind( _.throttle( function() {
				if ( this.$slider.slick( 'slickGetOption', 'autoplay' ) ) {
					if ( isElementInView( this.$slider ) ) {

						// 'slickPlay' also sets 'autoplay' option to true!
						// https://github.com/kenwheeler/slick#methods
						this.$slider.slick( 'slickPlay' );
					}
					else {
						this.$slider.slick( 'slickPause' );
					}
				}
			}, 1000, { leading: false } ), this ) );

			return this;
		},

		/**
		 * Initialize the Slick Carousel.
		 */
		initializeCarousel: function() {
			// Move the Twitter Bootstrap modal markup for video slides to just before closing body tag.
			this.moveModalsToRoot();

			// Initialize Slick Carousel.
			this.$slider.slick();

			// Show the whole slider (parent container is hidden by default).
			this.$parentContainer.css( 'visibility', 'visible' );

			return this;
		},

		/**
		 * Change the count of the current slide in the navigation container.
		 * Add a leading zero to a single digit. 1 -> 01, 12 -> 12.
		 */
		changeNavigationCount: function( currentSlide ) {
			$currentSliderNumber.html( ( '00' + (currentSlide + 1) ).slice(-2) );

			return this;
		},

		/**
		 * Move all video slide modal markup before the closing body tag.
		 */
		moveModalsToRoot: function() {
			this.$slider.find( '.js-pt-slick-carousel-video-modal-container' ).detach().children().appendTo( document.body );
		},

		/**
		 * Register the Bootstrap events for each modal used in the theme slider.
		 */
		registerModalEvents: function() {
			$( '.js-pt-slick-carousel-video-modal' ).on( 'show.bs.modal', _.bind( function ( e ) {
				if ( this.$slider.slick( 'slickGetOption', 'autoplay' ) ) {
					this.$slider.slick( 'slickPause' );
				}
			}, this ) );
		}

	} );

	return SlickCarousel;
} );
