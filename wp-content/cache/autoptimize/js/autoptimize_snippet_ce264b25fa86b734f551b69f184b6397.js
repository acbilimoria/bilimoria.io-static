try{jQuery(function(a){var d=a(panelsStyles.fullContainer);0===d.length&&(d=a("body"));var e=function(){var e=a(".siteorigin-panels-stretch.panel-row-style");e.each(function(){var e=a(this),t=e.data("stretch-type"),r="full-stretched-padded"===t?"":0;e.css({"margin-left":0,"margin-right":0,"padding-left":r,"padding-right":r});var i=e.offset().left-d.offset().left,n=d.outerWidth()-i-e.parent().outerWidth();e.css({"margin-left":-i,"margin-right":-n,"padding-left":"full"===t?i:r,"padding-right":"full"===t?n:r});var l=e.find("> .panel-grid-cell");"full-stretched"===t&&1===l.length&&l.css({"padding-left":0,"padding-right":0}),e.css({"border-left":0,"border-right":0})}),e.length&&a(window).trigger("panelsStretchRows")};a(window).on("resize load",e),e(),a("body").removeClass("siteorigin-panels-before-js")});}catch(e){}