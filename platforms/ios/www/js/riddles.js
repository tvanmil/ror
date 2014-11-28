// setup page init listeners
slickVar = "";

$('#pageHomescreen').bind( "pageshow", function( e, data ) {
	setTimeout( function() { app.receivedEvent('loginInitiated'); }, 1000 );
});

$('#pageRiddles').bind( "pageshow", function( e, data ) {
	carroussel.initialize();
});


var initCards = {};
initCards.riddles = [];
	
initCards.riddles.push({ // setup riddles for testing
	cardid		: 1,
	solved		: 1,
	question	: 'Poor people have it. Rich people need it. If you eat it you die. <br/><br/>What is it?',
	droppables	: [ " ", " ", "_", "_", "_", "_", " ", " " ],	
	draggables	: [ "A", "B", "C", "D", "E", "F", "G", "H" ],
	solution	: [ " ", " ", "B", "C", "D", "E"," ", " " ]
});
initCards.riddles.push({
	cardid		: 2,
	solved		: 0,
	question	: '2Poor people have it. Rich people need it. If you eat it you die. <br/><br/>What is it?',
	droppables	: [ " ", " ", "_", "_", "_", "_", " ", " " ],	
	draggables	: [ "A", "B", "C", "D", "E", "F", "G", "H" ],
	solution	: [ " ", " ", "B", "C", "D", "E"," ", " " ]
});
initCards.riddles.push({
	cardid		: 3,
	solved		: 0,
	question	: '3Poor people have it. Rich people need it. If you eat it you die. <br/><br/>What is it?',
	droppables	: [ " ", " ", "_", "_", "_", "_", " ", " " ],	
	draggables	: [ "A", "B", "C", "D", "E", "F", "G", "H" ],
	solution	: [ " ", " ", "B", "C", "D", "E"," ", " " ]
});

// clear local riddle object (for testing);
window.localStorage.removeItem( "riddles" );
window.localStorage[ "riddles" ] = JSON.stringify( initCards );

var carroussel = {
	
	initialized: false,
	cardDeleted: false,
	
	initialize: function() {
		
		_this = this;
		
		if (this.initialized) return true; // prevent double initialization, otherwise leads to errors
		
		console.log("Initializing carroussel.");
		$( "#card-caroussel" ).on( "swipeleft", ".card-container", this.swipeleftHandler);
		$( "#card-caroussel" ).on( "click", ".card-container", function(){ this.clickHandler; });
		$( "#card-caroussel" ).on( "swiperight", ".card-container", this.swiperightHandler);

		// initalize without gestures => feed gesture events from dragstart event,
		// then tell slick carousel to change the visible card.
		$( "#card-caroussel" ).slick({ 
			draggable: false,
			swipe: false,
			arrows: false,
			infinite: false,
			speed: 300,
			onAfterChange: function() {
				//carroussel.removeSlideAfterAnswer();
			}
		});

		this.downloadRiddles();
		this.loadSlides();
		this.initialized = true;

	},
	
	loadSlides: function() {

		// check if slides in local storage
		if ( window.localStorage[ "riddles" ] ) {
			// slides in local storage
			var json = JSON.parse(window.localStorage[ "riddles" ]);
			var unsolvedRiddles = jsonsql.query("select * from json.riddles where (solved==0) order by cardid asc limit 2", json);
			// loop through riddles searching for first unsolved riddle
			//console.log(unsolvedRiddles.length);
			if ( unsolvedRiddles.length > 0 ) {
				$.each( unsolvedRiddles, function( index, value ) {
					carroussel.addCard( card.initialize( value ) );	
				});
			}
			
		} else {
			// no slides in local storage => fetch new
		}
	},
	
	loadNewSlide: function( lastid ) {

		// check if slides in local storage
		if ( window.localStorage[ "riddles" ] ) {
			// slides in local storage
			var json = JSON.parse(window.localStorage[ "riddles" ]);
			var unsolvedRiddles = jsonsql.query("select * from json.riddles where ( solved==0 && cardid > "+lastid+" ) order by cardid asc limit 1", json);

			// loop through riddles searching for first unsolved riddle
			if ( !unsolvedRiddles[0] ) return false;
			return unsolvedRiddles[0];
		} else {
			// no slides in local storage => fetch new
		}
	},
	
	getLastCardId: function() {

		// check if slides in local storage
		if ( window.localStorage[ "riddles" ] ) {
			// slides in local storage
			var json = JSON.parse(window.localStorage[ "riddles" ]);
			var temp = jsonsql.query("select cardid from json.riddles order by cardid desc limit 1", json);
			return ( temp.length ? temp[0].cardid : 0);
		}
		return 0;
	},

	downloadRiddles: function() {

		$.post( "http://31.222.168.185/riddle/riddles.php", {
			action   	: 'getriddles',
			current		: this.getLastCardId()
		}, function(res) {
			var json = JSON.parse(res);
			if (json.updates == true) {
				// res.cards bevat array met nieuwe riddles
				var newRiddles = json.riddles;
				var curRiddles = JSON.parse(window.localStorage[ "riddles" ]);
				$.each(newRiddles, function ( index, value ){
					curRiddles.riddles.push(value);
				});
				window.localStorage[ "riddles" ] = JSON.stringify(curRiddles);
			}
		});		
	},

	removeSlideAfterAnswer: function() {
		console.log("afterchange called." + this.cardDeleted);
		if (this.cardDeleted) {
			$( "#card-caroussel" ).slickRemove( $( "#card-caroussel" ).slickCurrentSlide(), true );
			this.cardDeleted = false;	
		}		
	},	
		
	// Callback function references the event target and adds the 'swipeleft' class to it
	swipeleftHandler: function ( event ) {

		if ( $( ".slick-track .card-container" ).last().hasClass( "slick-active" ) ) {
			if (app.debug) alert("swipe l2");
			var x = carroussel.loadNewSlide( $( ".slick-track .card-container.slick-active" ).attr( "id" ).substring( 5 ) );
			if (x) carroussel.addCard( card.initialize( x ) );
		}
		
		$( "#card-caroussel" ).slickNext();
		
	},
	addCard: function(newcard) {
		$( "#card-caroussel" ).slickAdd(newcard);
		
		card.initializeDroppables();
		card.initializeDraggables();
		// card.resizeElements();
	},
	swiperightHandler: function ( event ){
		$( "#card-caroussel" ).slickPrev();
	},
	clickHandler: function ( event ) { 
		//console.log('click');
	},
	retrieveNewCard: function() {
		// get available card id's that are unsolved
	}
};

