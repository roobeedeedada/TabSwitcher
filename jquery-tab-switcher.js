/**
 *	https://github.com/roobeedeedada/tabswitcher
 * 	released under MIT License
 * 	feel free to minify
 */

KISCODE = {};

KISCODE.TabSwitcher = function( config ) {
	this.currentIdx = config.defaultTab ? config.defaultTab : 0;
	this.circular 	= config.circular;
	this.$container = $( config.container );
	this.$prev 		= $( config.prevButton );
	this.$next 		= $( config.nextButton );
	this.$buttons 	= this.$container.find('.clickable');
	this.$tabs 		= this.$container.find('.tab-content');
	this.animate 	= config.animate;
	this.eventType 	= $.inArray( config.eventType, [ 'hover', 'click' ] ) > -1 ? config.eventType : 'click';
	this.stateful 	= config.allowCookies;
	this.kiscookie 	= 'kistabs' + $.inArray( this, window.kismet.components );
	
	// Check if the jQuery.cookie is available
	if( this.stateful && $.cookie && $.cookie( this.kiscookie ) ) {
		this.currentIdx = parseInt( $.cookie( this.kiscookie ) );
	}

	this.$tabs.eq( this.currentIdx ).addClass('selected');
	this.switchTab( this.currentIdx );	

	var that = this;
	this.$buttons.each( function() {
		$( this ).on( that.eventType, function( e ) {
			var clickedIdx = $.inArray( this, that.$buttons );
			if( clickedIdx !== that.currentIdx ) {
				that.switchTab( clickedIdx );
				e.preventDefault();	
			}
		} );
	} );

	this.$prev.on( that.eventType, function( e ) {
		if( that.currentIdx > 0 ) {
			that.switchTab( that.currentIdx - 1 );
		} else if( that.circular ) {
			that.switchTab( that.$tabs.length - 1 );
		}
		e.preventDefault();
	} );

	this.$next.on( that.eventType, function( e ) {
		if( that.currentIdx < that.$tabs.length - 1 ) {
			that.switchTab( that.currentIdx + 1 );
		} else if( that.circular ) {
			that.switchTab( 0 );
		}
		e.preventDefault();
	} );
};

KISCODE.TabSwitcher.prototype.switchTab = function( index ) {
	// Handle tab highlighting
	this.$buttons.eq( this.currentIdx ).removeClass( 'highlight' );
	this.$buttons.eq( index ).addClass( 'highlight' );

	// Handle content switching
	if( this.animate ) {
		var that = this;
		this.$tabs.eq( that.currentIdx ).siblings('.tab-content').hide();
		this.$tabs.eq( that.currentIdx ).fadeOut( 'slow', function() {
			that.$tabs.eq( index ).fadeIn( 'slow' ).addClass('selected');
		} ).removeClass('selected');
	} else {
		this.$tabs.removeClass('selected').hide();
		this.$tabs.eq( index ).show().addClass('selected');
	}

	if( this.stateful && $.cookie ) {
		$.cookie( this.kiscookie, index );
	}

	this.currentIdx = index;
	return false;
};

