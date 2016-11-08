var running = false; // boolean to check if clock is active
var cycles = 0; // number of work/break cycles user has completed
var workMins = 25; // workMins variable for pomodoro (minutes), controlled by user	
$("#workMinDisp").html(workMins); // workMins display
$("#pause").prop("disabled", true).animate({ opacity: 0.4 }); // pause is disabled while clock is inactive

$("#decreaser").click(function(){
	if(workMins === 1){
		workMins = 60;
	} else {
		workMins -= 1;			
	}
	$("#workMinDisp").html(workMins);
}); // decrease workMins value, if 1, then go back to 30

$("#increaser").click(function(){
	if(workMins === 60){
		workMins = 1;
	} else {
		workMins += 1;
	}
	$("#workMinDisp").html(workMins);
}); // increase workMins value, if 30, then go back to 1


var breakMins = 5; // workMins variable for break (minutes)	
$("#breakMinDisp").html(breakMins);

$("#breakDecreaser").click(function(){
	if(breakMins === 1){
		breakMins = 60;
	} else {
		breakMins -= 1;			
	}
	$("#breakMinDisp").html(breakMins);
}); // decrease break time value, if 1, then go back to 60

$("#breakIncreaser").click(function(){
	if(breakMins === 60){
		breakMins = 1;
	} else {
		breakMins += 1;			
	}
	$("#breakMinDisp").html(breakMins);
}); // increase break time value, if 60, then go back to 1

var audio = new Audio('http://soundbible.com/grab.php?id=1599&type=mp3'); // store link to sound effect in variable

function beep() {
  audio.play(); // play audio
} // function to call for audio play

var updateTime; // declare setInterval ID globally so .click() function can access it for cancellation
var updateBreak; // declare setInterval ID globally so .click() function can access it for cancellation
var userWork; // declare storage var globally so .click() function can access it for value restoration
var userBreak; // same as above
var $prevMsg; // same as above

function timeWork() {
	userWork = workMins; // user settings for work length, will be used to restore original values on loop back into function
	userBreak = breakMins; // user settings for break length, will be used to restore original values on loop back into function
	workMins = workMins * 60; // convert to seconds
	breakMins = breakMins * 60; // convert to seconds	
	workMins--; // account for second long delay on activation of updateTime
	breakMins--; // account for second long delay on activation of updateBreak
	
	$("#msgSpace").hide().html("Session").fadeIn(500); // fade in message to work

	updateTime = setInterval(function(){
		if(workMins < 1 && !$("#pause").hasClass("paused")){
			$("#timeMinDisp").html(Math.floor(workMins/60)); // update minutes display with minutes (math floor used to remove decimal)
			if(workMins % 60 < 10) {
				$("#timeSecDisp").html("0" + (workMins % 60));
			} else {
			$("#timeSecDisp").html(workMins % 60); // update second display by taking modulo of minutes after division by 60
			}
			var workCalc = (100 - (100 * (workMins/(userWork * 60))));
			$("#loadBar").attr("style", ("background:linear-gradient(to top, #66CD00 "+workCalc+"%, transparent "+workCalc+"%, transparent 100%);"));
			clearInterval(updateTime); // end interval
			beep();
			$("#msgSpace").hide().html("Break").fadeIn(500);
			$("#timeMinDisp").html(userBreak); // display breakMins time in minutes
			$("#timeSecDisp").html("00"); // display "00" for seconds
			updateBreak = setInterval(function(){
				if(breakMins < 1 && !$("#pause").hasClass("paused")){
					var breakCalc = (100 - (100 * (breakMins/(userBreak * 60))));
					$("#loadBar").attr("style", ("background:linear-gradient(to top, #7AC5CD "+breakCalc+"%, transparent "+breakCalc+"%, transparent 100%);"));
					workMins = userWork; // reset time to original user selections
					$("#timeMinDisp").html(workMins); // update display to reflect change
					$("#timeSecDisp").html("00"); // update display to reflect change
					breakMins = userBreak;						
					clearInterval(updateBreak); // end interval, as this is last interval before work restarts
					beep();
					cycles++; // increment cycle now that break is completed
					$("#cycleSpace").hide().html("No. of work/break cycles completed: " + cycles).fadeIn(500);
					timeWork(); // call the function once more, to start work cycle
				} else if($("#pause").hasClass("paused")) {
					console.log("Break time is currently paused");
				} else {						
					$("#timeMinDisp").html(Math.floor(breakMins/60));
					if(breakMins % 60 < 10) {
						$("#timeSecDisp").html("0" + (breakMins % 60));
					} else {
						$("#timeSecDisp").html(breakMins % 60);
					} // if statements add a 0 to second timer when lower than 10 to maintain clock format (e.g. X:00)
					var breakCalc = (100 - (100 * (breakMins/(userBreak * 60)))); // store completion percentage calculation
					$("#loadBar").attr("style", ("background:linear-gradient(to top, #7AC5CD "+breakCalc+"%, transparent "+breakCalc+"%, transparent 100%);"));
					// fill loadBar with percentage of completed time
					$prevMsg = $("#msgSpace").html();
					breakMins--;
				}
			}, 1000); // after work clock reaches end point, activate break clock

		} else if($("#pause").hasClass("paused")){
			console.log("Interval is currently paused"); // print to console if button has pause class, don't decrement the timer
		} else {				
			$("#timeMinDisp").html(Math.floor(workMins/60)); // update minutes display with minutes (math floor used to remove decimal)
			if(workMins % 60 < 10) {
				$("#timeSecDisp").html("0" + (workMins % 60));
			} else {
				$("#timeSecDisp").html(workMins % 60); // update second display by taking modulo of minutes after division by 60
			}
			var workCalc = (100 - (100 * (workMins/(userWork * 60)))); // store completion percentage calculation
			$("#loadBar").attr("style", ("background:linear-gradient(to top, #66CD00 "+workCalc+"%, transparent "+workCalc+"%, transparent 100%);"));
			// fill loadBar with percentage of completed time
			$prevMsg = $("#msgSpace").html();
			workMins--; // decrement workMins variable by one second
		}
	}, 1000);// execute setInterval every 1000ms, has built-in termination via var ID		
}


$("#start").click(function() {		
	if(running === false){
		running = true; // clock is now active
		$(".timeSetRow").animate({ opacity: 0.4 }); // fade time controls out
		$("#pause").animate( { opacity: 1 }); // fade pause control in
		$("#pause").prop("disabled", false); // enable pause control			
		$("#increaser").prop("disabled", true); // disable controls
		$("#decreaser").prop("disabled", true);
		$("#breakIncreaser").prop("disabled", true);
		$("#breakDecreaser").prop("disabled", true);
		$("#msgSpace").hide();
		$("#loadBar").attr("style", "background: transparent");
		$("#timeMinDisp").html(workMins);
		$("#timeSecDisp").html("00");
		$("#start").text("Stop");					
		timeWork();
	} else {
		running = false;
		$(".timeSetRow").animate({ opacity: 1 }); // fade time controls in
		$("#pause").animate({ opacity: 0.4 }); // fade pause control out 	
		$("#pause").prop("disabled", true); // disable pause control		
		$("#increaser").prop("disabled", false); // enable controls
		$("#decreaser").prop("disabled", false);
		$("#breakIncreaser").prop("disabled", false);
		$("#breakDecreaser").prop("disabled", false);
		$("#msgSpace").hide().html("Set a time.").fadeIn(500);
		$("#loadBar").attr("style", "background: transparent;");
		$("#start").text("Start");
		clearInterval(updateTime);
		clearInterval(updateBreak);
		workMins = userWork;
		$("#timeMinDisp").hide().html("--").fadeIn(500);
		$("#timeSecDisp").hide().html("--").fadeIn(500);
		breakMins = userBreak;			
	}
}); // call timework on click

$("#pause").click(function() {
	if($("#pause").hasClass("paused")) {
		$("#pause").removeClass("paused");
		$("#start").prop("disabled", false); // enable stop/start button
		$("#start").animate({ opacity: 1 }); // fade in stop/start button
		$("#pause").text("Pause");
		$("#msgSpace").hide();
		$("#msgSpace").html($prevMsg); // replace previous message
		$("#msgSpace").fadeIn(500);
	} else {			
		$("#msgSpace").html("Paused");
		$("#start").prop("disabled", true); // disable stop/start button
		$("#start").animate({ opacity: 0.4 }); // fade out stop/start button			
		$("#pause").addClass("paused");
		$("#pause").text("Unpause");
	}
});