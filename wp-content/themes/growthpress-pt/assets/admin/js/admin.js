/**
 * Utilities for the admin dashboard
 */

jQuery( document ).ready( function( $ ) {
	'use strict';

	// Select Icon on Click.
	$( 'body' ).on( 'click', '.js-selectable-icon', function ( ev ) {
		ev.preventDefault();
		var $this = $( this );
		$this.siblings( '.js-icon-input' ).val( $this.data( 'iconname' ) ).change();
	} );

} );

jQuery( window ).on( 'load', function () {
	if ( jQuery.isFunction( wp.customize ) ) {
		wp.customize( 'page_header_bg_img', function( setting ) {
			var setupControl = function( control ) {
				var setActiveState, isDisplayed;
				isDisplayed = function() {
					return '' !== setting.get();
				};
				setActiveState = function() {
					control.active.set( isDisplayed() );
				};
				setActiveState();
				setting.bind( setActiveState );
			};

			wp.customize.control( 'page_header_bg_img_repeat', setupControl );
			wp.customize.control( 'page_header_bg_img_position', setupControl );
			wp.customize.control( 'page_header_bg_img_attachment', setupControl );
		} );

		wp.customize( 'body_bg_img', function( setting ) {
			var setupControl = function( control ) {
				var setActiveState, isDisplayed;
				isDisplayed = function() {
					return '' !== setting.get();
				};
				setActiveState = function() {
					control.active.set( isDisplayed() );
				};
				setActiveState();
				setting.bind( setActiveState );
			};

			wp.customize.control( 'body_bg_img_repeat', setupControl );
			wp.customize.control( 'body_bg_img_position', setupControl );
			wp.customize.control( 'body_bg_img_attachment', setupControl );
		} );
	}
} );


/********************************************************
 			Backbone code for repeating fields in widgets
********************************************************/

// Namespace for Backbone elements.
window.GrowthPress = {
	Models:    {},
	ListViews: {},
	Views:     {},
	Utils:     {},
};

/**
 ******************** Backbone Models *******************
 */

_.extend( GrowthPress.Models, {
	OpeningTimeItem: Backbone.Model.extend( {
		defaults: {
			'day': '',
			'time': '',
			'less-important': '',
		}
	} ),

	PricingPackageItem: Backbone.Model.extend( {
		defaults: {
			'text': '',
			'icon': 'fa-check',
			'icon_color': '#91bd52',
		}
	} ),
} );

/**
 ******************** Backbone Views *******************
 */

// Generic single view that others can extend from.
GrowthPress.Views.Abstract = Backbone.View.extend( {
	initialize: function ( params ) {
		this.templateHTML = params.templateHTML;

		return this;
	},

	render: function () {
		this.$el.html( Mustache.render( this.templateHTML, this.model.attributes ) );

		return this;
	},

	destroy: function ( ev ) {
		ev.preventDefault();

		this.remove();
		this.model.trigger( 'destroy' );
	},
} );

_.extend( GrowthPress.Views, {
	// View of a single opening time item.
	OpeningTimeItem: GrowthPress.Views.Abstract.extend( {
		className: 'pt-widget-single-opening-time-item',

		events: {
			'click .js-pt-remove-opening-time-item': 'destroy',
		},

		render: function () {
			this.$el.html( Mustache.render( this.templateHTML, this.model.attributes ) );

			this.$( 'input.js-less-important-checkbox' ).prop( 'checked', 'on' === this.model.get( 'less-important' ) );

			return this;
		},
	} ),

	// View of a single pricing package item.
	PricingPackageItem: GrowthPress.Views.Abstract.extend( {
		className: 'pt-widget-single-pricing-package-item',

		events: {
			'click .js-pt-remove-pricing-package-item': 'destroy',
		},

		render: function () {
			this.$el.html( Mustache.render( this.templateHTML, this.model.attributes ) );
			this.$( 'input.js-icon-input' ).val( this.model.get( 'icon' ) );
			this.$( '.js-pt-color-picker' ).wpColorPicker();
			return this;
		},
	} )
} );



/**
 ******************** Backbone ListViews *******************
 *
 * Parent container for multiple view nodes.
 */

GrowthPress.ListViews.Abstract = Backbone.View.extend( {

	initialize: function ( params ) {
		this.widgetId     = params.widgetId;
		this.itemsModel   = params.itemsModel;
		this.itemView     = params.itemView;
		this.itemTemplate = params.itemTemplate;

		// Cached reference to the element in the DOM.
		this.$items = this.$( params.itemsClass );

		// Collection of items(locations, people, testimonials,...).
		this.items = new Backbone.Collection( [], {
			model: this.itemsModel
		} );

		// Listen to adding of the new items.
		this.listenTo( this.items, 'add', this.appendOne );

		return this;
	},

	addNew: function ( ev ) {
		ev.preventDefault();

		var currentMaxId = this.getMaxId();

		this.items.add( new this.itemsModel( {
			id: (currentMaxId + 1)
		} ) );

		return this;
	},

	getMaxId: function () {
		if ( this.items.isEmpty() ) {
			return -1;
		}
		else {
			var itemWithMaxId = this.items.max( function ( item ) {
				return parseInt( item.id, 10 );
			} );

			return parseInt( itemWithMaxId.id, 10 );
		}
	},

	appendOne: function ( item ) {
		var renderedItem = new this.itemView( {
			model:        item,
			templateHTML: jQuery( this.itemTemplate + this.widgetId ).html()
		} ).render();

		var currentWidgetId = this.widgetId;

		// If the widget is in the initialize state (hidden), then do not append a new item.
		if ( '__i__' !== currentWidgetId.slice( -5 ) ) {
			this.$items.append( renderedItem.el );
		}

		return this;
	}
} );

_.extend( GrowthPress.ListViews, {
	// Collection of all opening time items, but associated with each individual widget.
	OpeningTimeItems: GrowthPress.ListViews.Abstract.extend( {
		events: {
			'click .js-pt-add-opening-time-item': 'addNew'
		}
	} ),

	// Collection of all pricing package items, but associated with each individual widget.
	PricingPackageItems: GrowthPress.ListViews.Abstract.extend( {
		events: {
			'click .js-pt-add-pricing-package-item': 'addNew'
		}
	} ),
} );

/**
 ******************** Repopulate Functions *******************
 */

_.extend( GrowthPress.Utils, {
	// Generic repopulation function used in all repopulate functions
	repopulateGeneric: function ( collectionType, parameters, json, widgetId ) {
		var collection = new collectionType( parameters );

		// Convert to array if needed
		if ( _( json ).isObject() ) {
			json = _( json ).values();
		}

		// Add all items to collection of newly created view
		collection.items.add( json, { parse: true } );
	},

	/**
	 * Function which adds the existing opening time items to the DOM
	 * @param  {json} openingTimeItemJSON
	 * @param  {string} widgetId ID of widget from PHP $this->id
	 * @return {void}
	 */
	repopulateOpeningTimeItems: function ( openingTimeItemJSON, widgetId ) {
		var parameters = {
			el:           '#opening-time-items-' + widgetId,
			widgetId:     widgetId,
			itemsClass:   '.opening-time-items',
			itemTemplate: '#js-pt-opening-time-item-',
			itemsModel:   GrowthPress.Models.OpeningTimeItem,
			itemView:     GrowthPress.Views.OpeningTimeItem,
		};

		this.repopulateGeneric( GrowthPress.ListViews.OpeningTimeItems, parameters, openingTimeItemJSON, widgetId );
	},

	/**
	 * Function which adds the existing pricing package items to the DOM
	 * @param  {json} pricingPackageItemJSON
	 * @param  {string} widgetId ID of widget from PHP $this->id
	 * @return {void}
	 */
	repopulatePricingPackageItems: function ( pricingPackageItemJSON, widgetId ) {
		var parameters = {
			el:           '#pricing-package-items-' + widgetId,
			widgetId:     widgetId,
			itemsClass:   '.pricing-package-items',
			itemTemplate: '#js-pt-pricing-package-item-',
			itemsModel:   GrowthPress.Models.PricingPackageItem,
			itemView:     GrowthPress.Views.PricingPackageItem,
		};

		this.repopulateGeneric( GrowthPress.ListViews.PricingPackageItems, parameters, pricingPackageItemJSON, widgetId );
	},
} );
