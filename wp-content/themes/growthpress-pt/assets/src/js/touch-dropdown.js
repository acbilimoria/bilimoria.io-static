'use strict';

import $ from 'jquery';
import _ from 'underscore';

/**
 * Main initialization function.
 */
const initTouchDropdown = () => {
	// We assume there is a global Moderniz object with test for touch
	if ( !! Modernizr ) {
		$( window ).on( 'resize', _.debounce( function () {
			var $mainMenuContainer = $( '.js-main-nav' );

			// Add the .js-dropdown class to all sub-menus within the main menu container.
			addDropdownClassToSubmenus( $mainMenuContainer );

			if ( Modernizr.mq( '(min-width: 992px)' ) && Modernizr.touchevents ) {
				// Remove any previous dropdown buttons from mobile layout.
				removeDropdownButtonsFromMenuItems( $mainMenuContainer );

				// Hide all submenus (display: block).
				showAllSubmenus( $mainMenuContainer );

				// Register the custom click event to simulate click/hover.
				registerMenuHoverClick( 'ul.js-dropdown' );
			}
			else if ( Modernizr.mq( '(max-width: 991px)' ) ) { // mobile layout (from 0 to 991px).
				// Disable custom click event from desktop layout.
				disableMenuHoverClick( 'ul.js-dropdown' );

				// Remove any previous dropdown buttons.
				removeDropdownButtonsFromMenuItems( $mainMenuContainer );

				// Hide all submenus (display: hidden).
				hideAllSubmenus( $mainMenuContainer );

				// Add buttons for mobile dropdown
				addDropdownButtonsToMenuItems( $mainMenuContainer );
			}
			else {
				// Disable custom click event from desktop layout.
				disableMenuHoverClick( 'ul.js-dropdown' );

				// Remove any previous dropdown buttons from mobile layout.
				removeDropdownButtonsFromMenuItems( $mainMenuContainer );

				// Hide all submenus (display: block).
				showAllSubmenus( $mainMenuContainer );
			}
		}, 100 ) );

		// Trigger the initial resize.
		$( window ).trigger( 'resize' );
	}
}



/**
 * Add the .js-dropdown class to all sub-menus of the menu container.
 *
 * @param $menuContainer The menu container (a jQuery object).
 */
function addDropdownClassToSubmenus( $menuContainer ) {
	$menuContainer.find( '.sub-menu' ).addClass( 'js-dropdown' );
}


/**
 * Register custom click event for each menu item with a submenu.
 *
 * @param submenuClass A class of submenus.
 */
function registerMenuHoverClick( submenuClass ) {
	$( submenuClass ).each( function ( i, elm ) {
		$( elm ).children( '.menu-item-has-children' ).on( 'click.td', 'a', function ( ev ) {
			ev.preventDefault();

			// Clear the hover state if you switch to other dropdown menu
			$( elm ).children( '.is-hover' ).removeClass( 'is-hover' );

			$( ev.delegateTarget ).addClass( 'is-hover' );
			$( ev.delegateTarget ).off( 'click.td' );
		} );
	} );
}


/**
 * Disable custom click event for each menu item with a submenu.
 *
 * @param submenuClass A class of submenus.
 */
function disableMenuHoverClick( submenuClass ) {
	$( submenuClass ).each( function ( i, elm ) {
		$( elm ).children( '.menu-item-has-children' ).off( 'click.td' );
	} );
}


/**
 * Add dropdown buttons with show/hide submenu event.
 *
 * @param $mainMenuContainer A main menu container.
 */
function addDropdownButtonsToMenuItems( $mainMenuContainer ) {
	const $dropdownButton = $( '<button />', { 'class': 'dropdown-toggle dropdown-toggle--close', 'aria-expanded': false })
		.append( '<i class="fa fa-chevron-down" aria-hidden="true"></i>' );

	$mainMenuContainer.find( '.menu-item-has-children > a' ).after( $dropdownButton );

	$mainMenuContainer.find( '.menu-item-has-children > button.dropdown-toggle' ).on( 'click.tdm', function ( ev ) {
		ev.preventDefault();

		$( ev.currentTarget ).siblings( '.sub-menu' ).toggle();

		$( ev.currentTarget )
			.toggleClass( 'dropdown-toggle--close' )
			.toggleClass( 'dropdown-toggle--open' );

		$( ev.currentTarget ).children( 'i.fa' )
			.toggleClass( 'fa-chevron-down' )
			.toggleClass( 'fa-chevron-up' );
	} );
}


/**
 * Remove dropdown buttons.
 *
 * @param $mainMenuContainer A main menu container.
 */
function removeDropdownButtonsFromMenuItems( $mainMenuContainer ) {
	$mainMenuContainer.find( '.menu-item-has-children > button.dropdown-toggle' ).remove();
}


/**
 * Hide all menu submenus.
 *
 * @param $mainMenuContainer A main menu container.
 */
function hideAllSubmenus( $mainMenuContainer ) {
	$mainMenuContainer.find( '.sub-menu' ).hide();
}


/**
 * Show all menu submenus.
 *
 * @param $mainMenuContainer A main menu container.
 */
function showAllSubmenus( $mainMenuContainer ) {
	$mainMenuContainer.find( '.sub-menu' ).show();
}

export { initTouchDropdown };
