

var carroussel = {
	
	initialize: function() {
	
		$("div:jqmData(role='content')").append('<div id="card-caroussel" style="height:100%;"></div>');

		$( "#card-caroussel" ).on( "swipeleft", ".card-container", this.swipeleftHandler);
		$( "#card-caroussel" ).on( "click", ".card-container", this.clickHandler);
		$( "#card-caroussel" ).on( "swiperight", ".card-container", this.swiperightHandler);

		// initalize without gestures => feed gesture events from dragstart event,
		// then tell slick carousel to change the visible card.
		$( "#card-caroussel" ).slick({ draggable: false, swipe: false, arrows: false });
		
	},
	// Callback function references the event target and adds the 'swipeleft' class to it
	swipeleftHandler: function ( event ) {
		console.log("swipe left detected.");
		$( "#card-caroussel" ).slickNext();
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
	}
};


var card = {

	cardId: 0,
	solution: [],
	
	initialize: function ( content ) {
		
		this.cardId = content.id;
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
	
		var $card = $( '<div id="card-'+id+'" class="card-container"></div' );
	
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
	
	resizeElements: function() {
		$( ".letter-card" ).css({
			fontSize: $( ".droppable" ).outerWidth()-5+"px",
			lineHeight: $( ".droppable" ).outerWidth()+"px"
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
			cursorAt: { bottom: -20 },
			snap: ".droppable", 
			revert: "invalid", 
			revertDuration: 300, 
			snapMode: "inner", 
			snapTolerance: 1, 
			stack: ".draggable",
			create: function(event, ui) { },
			start: function(event, ui) {
				/*console.log('x');
				console.log(event);
				console.log(event.target);*/
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
	testFunction: function() {
		console.log("A");
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
				$.each( ui.draggable.attr('class').split(" "), function( index, value ) {
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

		$.each( $(".slick-active").children(".dropzones").children(), function(k,v){ 

			var className = $(v).children().attr('class');
			var foundDroppedLetter = false;

			$.each( className.split(" "), function( index, value ){
				if ( value.substring(0,7) === 'letter-' ) { // this droppable has a number on it.
					console.log("val: "+value.substr(7));
					enteredSolution[i] = value.substr(7);
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
		
		console.log(enteredSolution);
		console.log(this.solution);
		if (this.equals(this.solution, enteredSolution) ) {
			// for all dropzone-containers, if contains a class which start with
			// "letter-", make it green for correct!
			console.log("Correct!");
			this.showCorrectVisuals();
		}
	},
	
	showCorrectVisuals: function() {
		$.each( this.solution, function( index, value) {
			if ( value !== " " ) $( ".slick-active .letters .letter-container .letter-"+value ).addClass('correct');
		});
	},
	
	equals: function (array1, array2) { // Supporting function to compare 2 arrays
	    // if the other array is a falsy value, return
	    if (!array1 || !array2)
	        return false;
	
	    // compare lengths - can save a lot of time 
	    if (array1.length != array2.length)
	        return false;
	
	    for (var i = 0, l=array1.length; i < l; i++) {        
	        if (array1[i] != array2[i]) { 
	            return false;   
	        }           
	    }       
	    return true;
	}
};


