$('#pageLogin').bind( "pageshow", function( e, data ) {
	console.log("pageshow called on #pageLogin");
	app.receivedEvent('loginInitiated');
});


var auth = {

	checkPreAuth : function() {
		return true;
		window.localStorage.removeItem( "email" );
		//console.log("checkPreAuth, user: "+window.localStorage["username"]+", pw: "+window.localStorage["password"]);
		var form = $( "#loginForm" );
		window.localStorage[ "email" ] = null;
		if (window.localStorage[ "email" ] != undefined && window.localStorage[ "password" ] != undefined) {
			console.log( "email saved" );
			$( "#email", form ).val( window.localStorage[ "email" ] );
			$( "#password", form ).val( window.localStorage[ "password" ] );
			handleLogin();
			return true;
		} else {
			console.log( "no email saved." );
			return false;
		}
	},
	
	handleLogin: function() {
		console.log( "handleLogin called." );
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
				if (res.authenticated == true) {
					//store
					window.localStorage["email"] = u;
					window.localStorage["password"] = p;
					//document.location.href = 'riddles.html'
					//$.mobile.changePage("riddles.html");
				} else {
					//navigator.notification.alert("Your login failed", function() {});
				}
				$( "#submitButton", form ).removeAttr( "disabled" );
			}, "json");
		} else {
			//Thanks Igor!
			navigator.notification.alert( "You must enter a username and password", function() { });
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
