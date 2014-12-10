/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */


var app = {
	
	debug: false,
	
    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicitly call 'app.receivedEvent(...);'
    onDeviceReady: function() {
    	
        app.receivedEvent('deviceready');

    },
    // Update DOM on a Received Event
    receivedEvent: function(id) {
        console.log('Received Event: ' + id);

    	if ( id === 'deviceready' ) navigator.splashscreen.hide();

		if ( id === 'loginInitiated' ) {
			
			//window.localStorage.removeItem( "email" ); // for testing
			//window.localStorage.removeItem( "password" ); // for testing
			
			auth.checkPreAuth( function(pre_authenticated){
				console.log("pre authenticated: "+pre_authenticated);
				if (pre_authenticated) {
					setTimeout( function() { $.mobile.changePage( "#pageRiddles", { 
						transition: "fade", 
						reverse: false, 
						changeHash: false 
					}); }, 500 );
					auth.getMyScore();
				} else { // open register button
					console.log("not logged in automatically");
					$( "#loginPopup" ).popup( "open" );
				}			

			});  // show riddle screen
		}
    }
};

app.initialize();



function showMessage(message, title){

	title = title || "default title";
	buttonName = buttonName || 'OK';
	
	if(navigator.notification && navigator.notification.alert){
	
		navigator.notification.alert(
			message,    // message
			function() {},   // callback
			title,      // title
			'OK'  // buttonName
		);
	
	}else{
		alert(message);
		callback();
	}

}