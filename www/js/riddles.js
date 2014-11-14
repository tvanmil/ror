// setup page init listeners
slickVar = "";

$('#pageRiddles').bind( "pageshow", function( e, data ) { 
	console.log("pageshow called on #pageRiddles");
	carroussel.initialize();
});


var initCards = {};
initCards.riddles = [];
	
initCards.riddles.push({
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
window.localStorage.removeItem( "riddles" );
window.localStorage[ "riddles" ] = JSON.stringify(initCards);

var carroussel = {
	
	initialize: function() {
	
		$( "#card-caroussel" ).on( "swipeleft", ".card-container", this.swipeleftHandler);
		$( "#card-caroussel" ).on( "click", ".card-container", this.clickHandler);
		$( "#card-caroussel" ).on( "swiperight", ".card-container", this.swiperightHandler);

		// initalize without gestures => feed gesture events from dragstart event,
		// then tell slick carousel to change the visible card.
		$( "#card-caroussel" ).slick({ draggable: false, swipe: false, arrows: false, infinite: false });

		this.loadSlides();
		
		this.setupInitialSlides();

	},
	
	loadSlides: function() {
		console.log('loadslides called');
		// check if slides in local storage
		if ( window.localStorage[ "riddles" ] ) {
			// slides in local storage
			var json = JSON.parse(window.localStorage[ "riddles" ]);
			var unsolvedRiddles = jsonsql.query("select * from json.riddles where (solved==0) order by cardid asc", json);
			console.log(unsolvedRiddles);
			// loop through riddles searching for first unsolved riddle
			
				
		} else {
			// no slides in local storage => fetch new
				
		}
		
			
	},
	loadNewSlide: function() {
		console.log('loadslides called');
		// check if slides in local storage
		if ( window.localStorage[ "riddles" ] ) {
			// slides in local storage
			var json = JSON.parse(window.localStorage[ "riddles" ]);
			var unsolvedRiddles = jsonsql.query("select * from json.riddles where (solved==0) order by cardid asc limit 1", json);
			// loop through riddles searching for first unsolved riddle
			
				
		} else {
			// no slides in local storage => fetch new
				
		}
		
			
	},	
	setupInitialSlides: function () {
		var c1 = {
			id			: 1,
			question	: 'Poor people have it. Rich people need it. If you eat it you die. <br/><br/>What is it?',
			droppables	: [ " ", " ", "_", "_", "_", "_", " ", " " ],	
			draggables	: [ "A", "B", "C", "D", "E", "F", "G", "H" ],
			solution	: [ " ", " ", "B", "C", "D", "E"," ", " " ]
		};
		carroussel.addCard(card.initialize(c1));
		c1.id = 2;
		carroussel.addCard(card.initialize(c1));		
	},
	
	// Callback function references the event target and adds the 'swipeleft' class to it
	swipeleftHandler: function ( event ) {
		console.log("swipe left detected.");
		if ( $(".slick-track .card-container").last().hasClass('slick-active') ) {
			// add new card to caroussel
			var c1 = {
				id			: 3,
				question	: 'Poor people have it. Rich people need it. If you eat it you die. <br/><br/>What is it?',
				droppables	: [ " ", " ", "_", "_", "_", "_", " ", " " ],	
				draggables	: [ "A", "B", "C", "D", "E", "F", "G", "H" ],
				solution	: [ " ", " ", "B", "C", "D", "E"," ", " " ]
			};
			carroussel.addCard(card.initialize(c1));
			$( "#card-caroussel" ).slickNext();				
		} else {
			$( "#card-caroussel" ).slickNext();	
		}
		
	},
	swiperightHandler: function ( event ){
		console.log("swipe right detected.");
		$( "#card-caroussel" ).slickPrev();
	},
	clickHandler: function ( event ) { 
		console.log('click');
	},
	addCard: function(card) {
		$( "#card-caroussel" ).slickAdd(card);
		//card.resizeElements();
	},
	retrieveNewCard: function() {
		// get available card id's that are unsolved
	}
};


var card = {

	//cardId: 0,
	solution: [],
	
	initialize: function ( content ) {
		
		//this.cardId = content.id;
		this.solution = content.solution;
		
		var $card = this.getNewCardHTML ( 
			content.id, 
			content.question, 
			content.droppables, 
			content.draggables
		);

		this.initializeDraggables();
		this.initializeDroppables();
	
		$( ".draggable" ).on( "swipeleft", function( event, ui ) { 
			event.preventDefault();
		});
		$( ".droppable" ).on( "swipeleft", function( event, ui ) { 
			event.preventDefault();
		});
		
		this.resizeElements();
		
		this.card = $card;

		return $card;
	},
	
	getNewCardHTML: function (id, title, droppables, draggables) {
	
		var $card = $( '<div id="card-'+id+'" class="card-container"></div>' );
	
		var $dropzones = $( '<div class="dropzones"></div>' );
		var $letters = $( '<div class="letters"></div>' );
		
		$card.append( '<h2>Riddle #'+id+'</h2>' );
		$card.append( '<h1>'+title+'</h1>' );
		
		$dropzones.append(this.getDroppableHTML(droppables));
		$letters.append(this.getDraggableHTML(draggables));
		
		$card.append($dropzones);
		$card.append($letters);
		
		return $card;
	},
	
	getCardId: function() {
		return $( ".slick-active" ).attr( "id" ).substring( 5 );
	},
	
	resizeElements: function() {
		$( ".letter-card" ).css({
			//console.log( $( ".droppable" ).outerWidth() );
			//fontSize: $( ".droppable" ).outerWidth()-5+"px",
			//lineHeight: $( ".droppable" ).outerWidth()+"px"
		});
	},
	
	getDraggableHTML: function (draggables) {
		var content = "";
		$.each(draggables, function( key, value) {
			content += '<div class="letter-container">' +
				'<div class="draggable letter-'+value+'">' +
				'<p class="letter-card">'+value+'</p>'+
				'</div></div>';
		});
		return content;
	},
	getDroppableHTML: function (droppables) {
		var content = "";
		$.each(droppables, function( key, value) {
			content += '<div class="dropzone-container">' +
				'<div class="' + (value !== ' ' ? 'droppable' : '') +'"><p class="letter-card">'+value+'</p>' +
				'</div></div>';
		});
		return content;
	},
	
	initializeDraggables: function () {
		$( ".draggable" ).draggable({
			cursorAt		: { bottom: -20 },
			snap			: ".droppable", 
			revert			: "invalid", 
			revertDuration	: 300, 
			snapMode		: "inner", 
			snapTolerance	: 1, 
			stack	 	 	: ".draggable",
			create: function(event, ui) { },
			start: function(event, ui) {
				event.stopPropagation();
				$( this ).addClass( "scaled" );
			},
			stop: function(event, ui) { event.stopPropagation(); },
			revert: function(is_valid_drop){
				if(!is_valid_drop){
					$( this ).removeClass( "scaled" );
					return true;
				}
			},
		});
	},

	initializeDroppables: function() {
	
		_this = this;
		$( ".droppable" ).droppable({
			drop: function( event, ui ) {

				$( ui.draggable ).removeClass( "scaled" );
				$( ui.draggable ).position({
					my: "center",
					at: "center",
					of: $( this )
				});
				
				var isDroppableFull = false;
				var presentElementId = 0;
				
				$.each( $( this ).attr( "class" ).split(" "), function( index, value ){
					if ( value.substr( 0,7 ) === 'letter-' ) {
						isDroppableFull = true;
						presentElementId = value.substring( 7 );
					}
				});
				
				// check if there already is an element in it
				if ( isDroppableFull ) {
					$( ".letter-"+presentElementId ).css({top: 0, left: 0});
					$( this ).addClass( "empty" ).removeClass( "letter-"+presentElementId );
				}

				// get classname of letter of dropped element and add it to the droppable classnames
				$.each( ui.draggable.attr( 'class' ).split( " " ), function( index, value ) {
					if ( value.substr( 0, 7 ) === "letter-" ) {
						droppedClassName = value;
					}
				});
				$( this ).addClass( droppedClassName );

				_this.checkSolution();	
			}
		});
	},
	
	checkSolution: function() {
		// dropzones hebben een klasse letter-x toegewezen gekregen als
		// er een letter op gedropt is.
		// loop over alle dropzones om te kijken welke letter daar op zit.
		// Dit moet gelijk zijn aan de solution.
		// Geen letter = " "

		var enteredSolution = [];
		var i = 0;

		$.each( $( ".slick-active" ).children( ".dropzones" ).children(), function( k, v ){ 

			var className = $( v ).children().attr( 'class' );
			var foundDroppedLetter = false;

			$.each( className.split( " " ), function( index, value ){
				if ( value.substring(0,7) === 'letter-' ) { // this droppable has a number on it.
					enteredSolution[i] = value.substr( 7 );
					foundDroppedLetter = true;
				}
			});
			if (!foundDroppedLetter) {
				enteredSolution[i] = " ";
			} else {
				//return false;
			}	
			i++;
		});
		
		//console.log(enteredSolution);
		//console.log(this.solution);
		if (this.equals(this.solution, enteredSolution) ) {
			// for all dropzone-containers, if contains a class which start with "letter-", make it green for correct!
			console.log("Correct!");
			this.uploadCompletedRiddle(enteredSolution);
		}
	},
	
	uploadCompletedRiddle: function(solution) {
		$.post("http://31.222.168.185/riddle/postscore.php", {
			action		: 'postscore',
			cardid		: this.getCardId(),
			email		: ( window.localStorage[ "email "] ? window.localStorage[ "email" ] : 'none' ),
			password	: ( window.localStorage[ "password "] ? window.localStorage[ "password" ] : 'none' ),
			solution	: JSON.stringify(solution)
		}, function(res) {
			console.log("result received: "+res);
			if (res.received == true) {
				// score has been received (and maybe validated in the future)
				console.log('true');
				this.showCorrectVisuals();
			} else {
				console.log('false');
				// score has not been received or incorrect
			}
		});
	},
	
	showCorrectVisuals: function() {
		$.each( this.solution, function( index, value) {
			if ( value !== " " ) $( ".slick-active .letters .letter-container .letter-" + value ).addClass( 'correct' );
		});
	},
	
	equals: function (array1, array2) { // Supporting function to compare 2 arrays
		// if the other array is a falsy value, return
		if ( !array1 || !array2 )
			return false;

		// compare lengths - can save a lot of time 
		if ( array1.length != array2.length )
			return false;
	
		for ( var i = 0, l = array1.length; i < l; i++ ) {        
			if ( array1[i] != array2[i] ) { 
				return false;   
			}
		}
		return true;
	}
};

