
var card = {

	solution: [],
	
	initialize: function ( content ) {
		
		//this.cardId = content.id;
		this.solution = content.solution;
		
		var $card = this.getNewCardHTML ( 
			content.cardid, 
			content.question, 
			content.solution, 
			content.draggables,
			content.points
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
	
	getNewCardHTML: function ( id, title, solution, draggables, points ) {
	
		var $card = $( '<div id="card-'+id+'" class="card-container"></div>' );
	
		var $dropzones = $( '<div class="dropzones"></div>' );
		var $letters = $( '<div class="letters"></div>' );
		
		$card.append( '<h2>Riddle #'+id+' - '+points+' points</h2>' );
		$card.append( '<h1>'+title+'</h1>' );
		
		$dropzones.append(this.getDroppableHTML(solution));
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
	
	getDraggableHTML: function ( draggables ) {
		var content = "";
		var counter = 0;
		$.each(draggables, function( key, value) {
			counter++;
			content += '<div class="letter-container">' +
				'<div class="draggable letter-'+value+'">' +
				'<p class="letter-card">'+value+'</p>'+
				'</div></div>';
			if ( counter == 8 ) {
				content += '<div style="float:left;clear:both;">&nbsp;</div><div style="float:left;clear:both;"></div>';
			}
		});
		return content;
	},
	getDroppableHTML: function ( droppables ) {
		var content = "";
		var counter = 0;
		$.each(droppables, function( key, value) {
			counter++;
			content += '<div class="dropzone-container">' +
				'<div class="droppable ' + (value !== ' ' ? 'droppable-visible' : 'droppable-invisible') +'">' +
				'<p class="letter-card">'+(value !== ' ' ? '_' : '&nbsp;')+'</p>' +
				'</div></div>';
			if ( counter == 8 ) {
				content += '<div style="float:left;clear:both;">&nbsp;</div><div style="float:left;clear:both;"></div>';
			}
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
		$( ".droppable-visible" ).droppable({
			drop: function( event, ui ) {

				$( ui.draggable ).removeClass( "scaled" );
				$( ui.draggable ).position({
					my: "center",
					at: "center",
					of: $( this )
				});
				
				var isDroppableFull = false;
				var presentElementId = 0;
				
				$.each( $( this ).attr( "class" ).split( " " ), function( index, value ){
					if ( value.substr( 0,7 ) === "letter-" ) {
						isDroppableFull = true;
						presentElementId = value.substring( 7 );
					}
				});
				
				// check if there already is an element in it
				if ( isDroppableFull ) {
					$( ".letter-"+presentElementId ).css({ top: 0, left: 0 });
					$( this ).addClass( "empty" ).removeClass( "letter-" + presentElementId );
				}

				// get classname of letter of dropped element and add it to the droppable classnames
				$.each( ui.draggable.attr( "class" ).split( " " ), function( index, value ) {
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
			
			if ( $( v ).children().attr( "class" ) == undefined ) return; // If div is spacing div, continue with next
			
			
			var className = $( v ).children().attr( "class" );
			console.log("className:"+className);
			var foundDroppedLetter = false;
			$.each( className.split( " " ), function( index, value ){
				if ( value.substring( 0,7 ) === "letter-" ) { // this droppable has a number on it.
					enteredSolution[i] = value.substr( 7 );
					foundDroppedLetter = true;
				}
			});
			if ( !foundDroppedLetter ) {
				enteredSolution[i] = " ";
			} else {
				//return false;
			}	
			i++;
		});

		var solution = ( this.getSolution(this.getCardId()) ).solution;
		if (this.equals(solution, enteredSolution) ) {
			alert("Solution correct!");
			// for all dropzone-containers, if contains a class which start with "letter-", make it green for correct!
			this.uploadCompletedRiddle(enteredSolution);
		}
	},

	getSolution: function( cardid ) {
		if ( window.localStorage[ "riddles" ] ) {

			var json = JSON.parse(window.localStorage[ "riddles" ]);
			var unsolvedRiddles = jsonsql.query("select solution from json.riddles where (cardid=="+cardid+") limit 1", json);

			if ( unsolvedRiddles.length > 0 ) {
				return unsolvedRiddles[0];
			} else {
				return false;
			}
			
		} else {
			return false; 
		}		
	},
	
	uploadCompletedRiddle: function( solution ) {
		_this = this;
		
		$.post( "http://31.222.168.185/riddle/index.php", {
			action		: "postscore",
			cardid		: this.getCardId(),
			email		: ( window.localStorage[ "email" ] ? window.localStorage[ "email" ] : "none" ),
			password	: ( window.localStorage[ "password" ] ? window.localStorage[ "password" ] : "none" ),
			solution	: JSON.stringify(solution)
		}, function(res) {
			res = JSON.parse( res );
			if ( res.success == true ) {
				// score has been received (and maybe validated in the future)
				_this.showCorrectVisuals( _this.getCardId() );
				_this.setCardCompleted( _this.getCardId() );
				auth.getMyScore();
			} else {
				// score has not been received or incorrect
			}
		});
	},
	setCardCompleted: function ( id ) {
		var json = JSON.parse( window.localStorage[ "riddles" ] );
		
		$.each( json.riddles, function( index, value ){
			if ( value.cardid == id ) {
				value.solved = 1;
				//json.riddles.splice(index, 1);
				return false;
			}
		});
		
		window.localStorage.removeItem( "riddles" );
		window.localStorage[ "riddles" ] = JSON.stringify( json );
	},
	
	showCorrectVisuals: function( id ) {
		console.log('show correct called.');
		$.each( ( this.getSolution(this.getCardId()) ).solution, function( index, value) {
			console.log(value);
			if ( value !== " " ) $( ".slick-active .letters .letter-container .letter-" + value ).addClass( "correct" );
		});

		console.log("currentA: "+$( "#card-caroussel" ).slickCurrentSlide() );
		// timeout and call slidenext();
		carroussel.cardDeleted = true;
		setTimeout( function() { 
			$( ".card-container.slick-active" ).trigger( "swipeleft" );
		}, 1500 );
	},

	equals: function ( array1, array2 ) { // Supporting function to compare 2 arrays
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


