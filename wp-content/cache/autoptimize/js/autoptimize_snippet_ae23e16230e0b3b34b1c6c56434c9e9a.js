try{jQuery(function($){$('nav > ul').on('focus.wparia  mouseenter.wparia','[aria-haspopup="true"]',function(ev){$(ev.currentTarget).attr('aria-expanded',true);});$('nav > ul').on('blur.wparia  mouseleave.wparia','[aria-haspopup="true"]',function(ev){$(ev.currentTarget).attr('aria-expanded',false);});});}catch(e){}