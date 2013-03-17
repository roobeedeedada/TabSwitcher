/**
 *	https://github.com/roobeedeedada/tabswitcher
 * 	released under MIT License
 * 	feel free to minify
 */

KISCODE = {};

KISCODE.TabSwitcher = function( config ) {
	this.currentIdx = config.defaultTab ? config.defaultTab : 0;
	this.container 	= config.container;
	this.circular 	= config.circular;
	this.$container = $$( config.container );
	this.$prev 		= $$( config.prevButton );
	this.$next 		= $$( config.nextButton );
	this.$buttons 	= $$( config.container + ' [class="clickable"]');
	this.$tabs 		= $$( config.container + ' [class="tab-content"]');
	this.animate 	= config.animate;
	this.eventType 	= config.eventType === 'hover' ? 'hover' : 'click';


	if( this.$tabs.length ) {
		this.$tabs[ this.currentIdx ].addClassName('selected');
		this.switchTab( this.currentIdx );
	}	

	var that = this;
	this.$buttons.each( function( button ) {
		button.observe( that.eventType, function( e ) {
			var element = e.element();
			var clickedIdx = element.previousSiblings().size();
			if( clickedIdx !== that.currentIdx ) {
				that.switchTab( clickedIdx );
				return false;
			}
		} );
	} );

	this.$prev.each( function( button ) {
		button.observe( that.eventType, function( e ) {
			if( that.currentIdx > 0 ) {
				that.switchTab( that.currentIdx - 1 );
			} else if( that.circular ) {
				that.switchTab( that.$tabs.length - 1 );
			}
			return false;
		} );
	} );

	this.$next.each( function( button ) {
		button.observe( that.eventType, function( e ) {
			if( that.currentIdx < that.$tabs.length - 1 ) {
				that.switchTab( that.currentIdx + 1 );
			} else if( that.circular ) {
				that.switchTab( 0 );
			}
			return false;
		} );
	} );
};

KISCODE.TabSwitcher.prototype.getCookie = function( name ) {
	var cookie = name + '=';
	var array = document.cookie.split(';');
	for( var i = 0, iLimit = array.length; i < iLimit; i++ ) {
		var c = array[i];
		while ( c.charAt(0) == ' '){
			c = c.substring( 1, c.length );
		}
		if(c.indexOf(cookie) == 0) {
			var result = c.substring(cookie.length, c.length);
			return unescape(result);
		};
	}
	return null;
};

KISCODE.TabSwitcher.prototype.switchTab = function( index ) {
	// Handle tab highlighting
	if( this.$buttons.length ) {
		this.$buttons[ this.currentIdx ].removeClassName( 'highlight' );
		this.$buttons[ index ].addClassName( 'highlight' );
	}

	var that = this;
	// Handle content switching
	if( this.$tabs.length ) {
		if( this.animate ) {
			$$( that.container + ' [class="tab-content"]:not(.selected)' ).invoke('hide');
			that.$tabs[ that.currentIdx ].removeClassName('selected');
			$$( that.container + ' [class="tab-content"]:nth(' + that.currentIdx + ')').invoke( 'fade', { duration: 0.1, afterFinish: function() {
				$$( that.container + ' [class="tab-content"]:nth(' + index + ')').invoke( 'appear', { duration: 0.2 } );
				that.$tabs[ index ].addClassName('selected');
			} } );
		} else {
			this.$tabs.each( function( tab ) {
				tab.removeClassName('selected')
			} );
			$$( that.container + ' [class="tab-content"]' ).invoke('hide');
			$$( that.container + ' [class="tab-content"]:nth(' + index + ')').invoke('show')
			that.$tabs[ index ].addClassName('selected');
		}

		this.currentIdx = index;
	}

	return false;
};