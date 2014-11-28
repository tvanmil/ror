/*
 * This method enables error javascript error logging within the
 * Cordova application. As it is HTML/CSS/JavaScript, an error will
 * not display on a phone as there is no console, but the code does
 * stop functioning.
 *  
 * This method makes sure those errors are sent to a server for
 * later analysis.
 */


// override the onerror object
window.onerror = function(msg, url, line) {
	
	var logJSErrors = true;
	var suppressJSErrors = false;
	
	// does our global system want to log errors - this could be a Client or Serverside setting
	if (logJSErrors) {
		
		console.log(typeof device);
		//console.log( device);
		if (typeof device === 'undefined') {
			var data = {
				action		: 'posterror',
				message		: msg,
				url			: url,
				line		: line			
			};			
		} else {
			var data = {
				action		: 'posterror',
				message		: msg,
				url			: url,
				line		: line,
				model		: device.model,
				cordova		: device.cordova,
				platform	: device.platform,
				version		: device.version,
				name		: device.name			
			};
		}
		// using JQuery to post a GET request to a page that logs the error details
		$.post( "http://31.222.168.185/riddle/posterror.php", data, function(res) {
			console.log(res);
			res = JSON.parse(res);
			if (res.success == true) {
				// log received
			} else {
				// log not received
			}
		});
	}

	// do we still raise the error or for old browsers which might have a lot of errors
	// do we try and supress them? Use our global config options again.
	if (suppressJSErrors) {
		// return true to suppress the error so its not raised to the console.
		return true;
	} else {
		// return false to raise the error to the console.
		return false;
	}
};