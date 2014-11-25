$('#pageLogin').bind( "pageshow", function( e, data ) {
	//console.log("pageshow called on #pageLogin");
	app.receivedEvent('loginInitiated');
});
$( "#registerButton" ).on( "click" ,function(event){
	auth.register();
});
	
$("#loginForm").on("submit",function(event){
	event.preventDefault();

	if ( auth.login() ) {
		setTimeout( function() { $.mobile.changePage( "#pageRiddles", { 
			transition: "fade", 
			reverse: false, 
			changeHash: false 
		}); }, 1500 );							
	}
});
			
var auth = {

	checkPreAuth: function() {

		//window.localStorage.removeItem( "email" );
		var form = $( "#loginForm" );
		
		if ( window.localStorage[ "email" ] != undefined && window.localStorage[ "password" ] != undefined ) {
			alert( window.localStorage[ "email" ] + " - " + window.localStorage[ "password" ]);
			$( "#email", form ).val( window.localStorage[ "email" ] );
			$( "#password", form ).val( window.localStorage[ "password" ] );
			this.handleLogin();
			return true;
		}
		return false;
	},
	
	login: function() {

		var form = $( "#loginForm" );

		//disable the button so we can't resubmit while we wait
		$( "#registerButton", form ).attr( "disabled", "disabled" );

		var u = $( "#email", form).val();
		var p = $( "#password", form).val();
		if (u != '' && p != '') {
			$.post( "http://31.222.168.185/riddle/auth.php?method=login&returnformat=json", {
				action   	: 'register',
				email 		: u,
				password	: p
			}, function(res) {
				alert(JSON.stringify(res));
				//navigator.notification.alert("Your login failed", function() {});
				$( "#registerButton", form ).removeAttr( "disabled" );
				if (res.authenticated == true) {
					window.localStorage[ "email" ] = u;
					window.localStorage[ "password" ] = p;
					return true;
				} else {
					return false;
				}
			}, "json");
		} else {
			alert( "You must enter a username and password" );
			$( "#registerButton", form ).removeAttr( "disabled" );
		}
		return false;
	},
	
	register: function() {
		console.log("test");
		var form = $( "#loginForm" );

		//disable the button so we can't resubmit while we wait
		$( "#submitButton", form ).attr( "disabled", "disabled" );

		var u = $( "#email", form).val();
		var p = $( "#password", form).val();
		if (u != '' && p != '') {
			$.post( "http://31.222.168.185/riddle/auth.php?method=login&returnformat=json", {
				action   	: 'login',
				email 		: u,
				password	: p
			}, function(res) {
				$( "#submitButton", form ).removeAttr( "disabled" );
				alert(JSON.stringify(res));

				if (res.authenticated == true) {

					window.localStorage[ "email" ] = u;
					window.localStorage[ "password" ] = p;
					return true;
				} else {
					return false;
				}
			}, "json");
		} else {
			alert( "You must enter a username and password" );
			$( "#submitButton", form ).removeAttr( "disabled" );
		}
		return false;
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
