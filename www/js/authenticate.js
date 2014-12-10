$('#pageLogin').bind( "pageshow", function( e, data ) {
	//app.receivedEvent('loginInitiated...');	
});
$('#pageLeaderboard').bind( "pageshow", function( e, data ) {
	auth.getLeaderboardScore();
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
			$.post( "http://31.222.168.185/riddle/index.php", {
				action   	: 'login',
				email 		: u,
				password	: p
			}, function(res) {
				$( "#registerButton", form ).removeAttr( "disabled" );
				if (res.success == true) {
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
			$.post( "http://31.222.168.185/riddle/index.php", {
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
		$.post( "http://31.222.168.185/riddle/index.php", {
			action		: 'getscores',
			email		: ( window.localStorage[ "email "] ? window.localStorage[ "email" ] : 'none' ),
			password	: ( window.localStorage[ "password "] ? window.localStorage[ "password" ] : 'none' ),
		}, function(res) {
			res = JSON.parse(res);
			if (res.success == true) {
				str = "<table><thead><tr><th width=17%>Rank</th><th width=23%>Points</th><th>User</th></tr></thead>";
				var counter = 1;
				$.each( res.scores, function( index, value ){
					str += "<tr class='"+( counter % 2 ? '' : 'alt' )+"'><td>"+counter+"</td><td>"+value.score+"</td><td>"+value.id+"</td></tr>";
					counter++;
				});
				str += "</tbody></table>";
				$( "#pageLeaderboard div[data-role='content'] #leaderboard" ).html(str);
			} else {
				// do nothing?
			}
		});
	},

	getMyScore: function() {
		console.log("getmyscore called.");
		$.post( "http://31.222.168.185/riddle/index.php", {
			action		: 'myscore',
			email		: ( window.localStorage[ "email" ] ? window.localStorage[ "email" ] : 'none' )
		}, function(res) {
			res = JSON.parse(res);
			if (res.success == true) {
				$( ".score-counter" ).html( res.score );
			} else {
				console.log ("Error!");
				// do nothing?
			}
		});
	}	

};
