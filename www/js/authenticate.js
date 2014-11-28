$('#pageLogin').bind( "pageshow", function( e, data ) {
	//console.log("pageshow called on #pageLogin");
	app.receivedEvent('loginInitiated');
});
$( "#registerButton" ).on( "click", function(event){
	auth.register( function(result) {
		if (result.success == true) {
			setTimeout( function() { $.mobile.changePage( "#pageRiddles", { 
				transition: "fade", 
				reverse: false, 
				changeHash: false 
			}); }, 500 );
		} else if (result.message == 2) {
			alert('Please choose a different username.');
		}
	});
});

$("#loginForm").on( "submit", function(event){
	event.preventDefault();

	auth.login( function( result ) {
		if (result) {
			setTimeout( function() { $.mobile.changePage( "#pageRiddles", { 
				transition: "fade", 
				reverse: false, 
				changeHash: false 
			}); }, 1500 );							
		} else {

		}
	});
});
			
var auth = {

	checkPreAuth: function(callback) {
		var form = $( "#loginForm" );
		
		if ( window.localStorage[ "email" ] != undefined && window.localStorage[ "password" ] != undefined ) {
			$( "#email", form ).val( window.localStorage[ "email" ] );
			$( "#password", form ).val( window.localStorage[ "password" ] );
			this.login( function( result ) {
				console.log("1: "+result);
				callback(result);
			});
		} else {
			callback(false);
		}
	},
	
	login: function(callback) {

		var form = $( "#loginForm" );

		//disable the button so we can't resubmit while we wait
		$( "#registerButton", form ).attr( "disabled", "disabled" );

		var u = $( "#email", form).val();
		var p = $( "#password", form).val();
		if (u != '' && p != '') {
			$.post( "http://31.222.168.185/riddle/auth.php?returnformat=json", {
				action   	: 'login',
				email 		: u,
				password	: p
			}, function(res) {
				$( "#registerButton", form ).removeAttr( "disabled" );
				if (res.authenticated == true) {
					window.localStorage[ "email" ] = u;
					window.localStorage[ "password" ] = p;
					callback(true);
				} else {
					callback(false);
				}
			}, "json");
		} else {
			alert( "Please fill out both fields." );
			$( "#registerButton", form ).removeAttr( "disabled" );
			callback(false);
		}
	},
	
	register: function(callback) {

		var form = $( "#loginForm" );

		//disable the button so we can't resubmit while we wait
		$( "#submitButton", form ).attr( "disabled", "disabled" );

		var u = $( "#email", form).val();
		var p = $( "#password", form).val();
		if (u != '' && p != '') {
			$.post( "http://31.222.168.185/riddle/auth.php?returnformat=json", {
				action   	: 'register',
				email 		: u,
				password	: p
			}, function(res) {
				$( "#submitButton", form ).removeAttr( "disabled" );
				
				if (res.success == true) {
					window.localStorage[ "email" ] = u;
					window.localStorage[ "password" ] = p;
					callback(res);
				} else {
					callback(res);
				}
			}, "json");
		} else {
			alert( "Please fill out both fields." );
			$( "#submitButton", form ).removeAttr( "disabled" );
			callback(false);
		}
	},
		
	getLeaderboardScore: function() {
		console.log( "leaderboard called." );
		$.post( "http://31.222.168.185/riddle/getleaderbord.php", {
			action		: 'getscore',
			email		: ( window.localStorage[ "email "] ? window.localStorage[ "email" ] : 'none' ),
			password	: ( window.localStorage[ "password "] ? window.localStorage[ "password" ] : 'none' ),
		}, function(res) {
			console.log(res);
			if (res.received == true) {
				// update leaderboard score
			} else {
				// do nothing?
			}
		});
	}

};
