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
		/*
    	if ( id === 'loginInitiated' ) {
			$("#loginForm").on("submit",function(event){
				event.preventDefault();
				console.log('submit triggered');
				auth.handleLogin();
			});
			//if ( auth.checkPreAuth() ) $.mobile.changePage('#pageRiddles',{transition: "slideup", reverse: false, changeHash: false});
		}
		*/
		console.log(id);
		if ( id === 'loginInitiated' ) {
			//$.mobile.changePage('#pageRiddles',{transition: "slideup", reverse: false, changeHash: false});
			//$.mobile.changePage('#pageRiddles',{transition: "slide", reverse: false, changeHash: false});
			
			// add label with 'checking login'
			console.log("AXA");
			console.log($( "div[data-role='page']#pageHomescreen div[data-role='content']" ));
			$( "div[data-role='page']#pageHomescreen div[data-role='content']" ).append( "Checking login..." );
			
			if ( auth.checkPreAuth() ) {
				console.log("AAAAAA");
			}
			setTimeout(
				function() {
					$.mobile.changePage('#pageRiddles',{transition: "slide", reverse: false, changeHash: false});
				}, 500
			);
			
		}
        //var parentElement = document.getElementById(id);
        //var listeningElement = parentElement.querySelector('.listening');
        //var receivedElement = parentElement.querySelector('.received');

        //listeningElement.setAttribute('style', 'display:none;');
        //receivedElement.setAttribute('style', 'display:block;');

        console.log('Received Event: ' + id);
    }
};

app.initialize();