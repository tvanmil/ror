

var cards = {

	draggables: [ "A", "B", "C", "D", "E", "F", "G", "H", "I", "J" ],
	droppables: [ ".", ".", ".", ".", ".", ".", ".", ".", ".", "." ],
	
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

	initialize: function () {
	
		var card = this.getNewCardHTML(1, 'build a tree', 'room_of_riddles', this.droppables, this.draggables);
		var card2 = this.getNewCardHTML(2, 'build a tree2', 'room_of_riddles', this.droppables, this.draggables);
	
		$("div:jqmData(role='content')").append('<div id="card-caroussel" style="height:100%;"></div>');

		// Bind the swipeleftHandler callback function to the swipe event on div.box
		$( "#card-caroussel" ).on( "swipeleft", ".card-container", this.swipeleftHandler);
		$( "#card-caroussel" ).on( "click", ".card-container", this.clickHandler);
		$( "#card-caroussel" ).on( "swiperight", ".card-container", this.swiperightHandler);

		
		$( "#card-caroussel" ).append(card);
		$( "#card-caroussel" ).append(card2);
		
		this.initializeDraggables();
		this.initializeDroppables();
	
		$( ".draggable" ).on( "swipeleft", function( event, ui ) { 
			console.log('y1');
			event.preventDefault();
		});
		$( ".droppable" ).on( "swipeleft", function( event, ui ) { 
			console.log('y2');
			event.preventDefault();
		});
		
		// initalize without gestures => feed gesture events from
		// dragstart event, then tell slick carousel to change
		// the visible card.
		$( "#card-caroussel" ).slick({ draggable: false, swipe: false });
		$( "#card-caroussel" ).on( "click", ".card-container", function(event) { console.log("click3"); });
		
		this.resizeElements();		
	},
	
	getNewCardHTML: function (id, title, image, droppables, draggables) {
	
		var $card = $( '<div id="card-'+id+'" class="card-container"></div' );
	
		var $dropzones = $( '<div class="dropzones"></div>' );
		var $letters = $( '<div class="letters"></div>' );
		
		$card.append( '<h2>Riddle # '+id+'</h2>' );
		$card.append( '<h1>'+title+'</h1>' );
		console.log('src="img/'+image+'.png"');
		$card.append( '<img class="riddle-image" src="img/'+image+'.png" />' );
		
		$dropzones.append(this.getDroppableHTML(this.droppables));
		$letters.append(this.getDraggableHTML(this.draggables));
		
		$card.append($dropzones);
		$card.append($letters);
		
		return $card;
	},
	
	resizeElements: function() {
		$( ".letter-card" ).css({
			fontSize: $( ".droppable" ).outerWidth()-5+"px",
			lineHeight: $( ".droppable" ).outerWidth()+"px"
		});
		$( "h1" ).css({ fontSize: $( ".droppable" ).outerWidth()/2+"px" });
		console.log($( ".droppable" ).outerWidth()/2+"px");
	},
	
	getDraggableHTML: function (draggables) {
		var content = "";
		$.each(this.draggables, function( key, value) {
			content += '<div class="letter-container">' +
			'<div id="letter-'+key+'" class="draggable">' +
			'<p class="letter-card">'+value+'</p>'+
			'</div></div>';
			//$( "#letters" ).append('<div class="letter-container"><div id="letter-'+key+'" class="draggable"><p class="letter-card">'+value+'</p></div></div>');
		});
		return content;
	},
	getDroppableHTML: function (droppables) {
		var content = "";
		$.each(this.droppables, function( key, value) {
			content += '<div class="dropzone-container">' +
			'<div class="droppable"><p class="letter-card">'+value+'</p>' +
			'</div></div>';
			//$( "#dropzones" ).append('<div class="dropzone-container"><div class="droppable"><p class="letter-card">'+value+'</p>' + '</div></div>');
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
				console.log('x');
				console.log(event);
				console.log(event.target);
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
				
				console.log($( this ).attr( "class" ));
				
				$.each($( this ).attr( "class" ).split(" "), function(index, value){
					if ( value.substr(0,7) === 'letter-' ) {
						isDroppableFull = true;
						presentElementId = value.substring(7);
					}
				});
				
				// check if there already is an element in it
				if ( isDroppableFull ) {
					$( "#letter-"+presentElementId ).css({top: 0, left: 0});
					$( this ).addClass( "empty" ).removeClass( "letter-"+presentElementId );
				}
				$( this ).addClass( ui.draggable.attr("id") );
			}
		});
	}
	
};


