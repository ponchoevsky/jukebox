// This is a manifest file that'll be compiled into application.js, which will include all the files
// listed below.
//
// Any JavaScript/Coffee file within this directory, lib/assets/javascripts, vendor/assets/javascripts,
// or any plugin's vendor/assets/javascripts directory can be referenced here using a relative path.
//
// It's not advisable to add code directly here, but if you do, it'll appear at the bottom of the
// compiled file.
//
// Read Sprockets README (https://github.com/rails/sprockets#sprockets-directives) for details
// about supported directives.
//
//= require jquery
//= require bootstrap-sprockets
//= require jquery_ujs
//= require turbolinks
//= require_tree .

var is_playing = false;
var note = document.createElement('audio');

var combos = [];

var sequence = [];
var sequence_pointer = 0;

var chain_pointer = Math.floor((Math.random() * 9));

var chain = ["49,70,66,63,66,70,49,70,66,63,66,70",
			 "58,60,62,67,62,60,58,60,62,67,62,60",
			 "70,79,77,79,77,75,70,79,72,84,79,82",
			 "66,62,64,66,61,73,71,73,71,69,69,66",
			 "76,75,76,75,76,71,74,72,69,64,69,72",
			 "52,57,60,52,43,57,60,52,41,57,60,52",
			 "75,78,83,85,73,78,83,85,71,78,83,85",
			 "48,50,55,48,50,55,48,47,50,55,47,50",
			 "78,76,62,63,56,58,56,55,60,76,62,63"];



function chain_search(){

	combos = [];
	sequence = [];
	var chain_pointer = Math.floor((Math.random() * 9));

	for (i = 41; i <= 83; i++) {
		for (j = 41; j <= 83; j++){
			var pair = i + "," + j;
			var occurrences = 0;
			var a = chain[chain_pointer].indexOf(pair);
			while(a > -1){
			    occurrences++;
			    a = chain[chain_pointer].indexOf(pair, ++a);
			}
			if (occurrences > 0)
				combos.push([pair , (occurrences * 100 / 11)]);
		}
	}
}



function roulette(){
	var pointer = Math.floor((Math.random() * 100));
	var count = 0;
	var stop = 0;
	for (i = 0; i < combos.length; i++){
		stop = i;
		if (pointer > count)
			count += combos[i][1];
		else
			break;
	}

	temp_sequence = combos[stop][0].split(",");
	sequence.push(parseInt(temp_sequence[0]));
	sequence.push(parseInt(temp_sequence[1]));
	if(sequence.length < 24)
		roulette();
}



function start(){
	if (sequence.length == 0 || sequence_pointer == 24){ //no sequence 
		chain_search();
		roulette();
		sequence_pointer = 0;
	}
	MIDI.noteOn(0, sequence[sequence_pointer], 127, 0);
	sequence_pointer++;
	if (is_playing)
		setTimeout(start, 500);
}



$(document).ready(function(){
 	$("#play-btn").click(function(){
 		is_playing = !is_playing;
 		chain_pointer = Math.floor((Math.random() * 11));
 		combos = [];
 		if(is_playing){
 			$(this).removeClass("btn btn-primary btn-lg").addClass("btn btn-danger btn-lg");
 			$(this).text("Stop playing");
 			sequence_pointer = 0;
 			start();
 		}
 		else{
 			$(this).removeClass("btn btn-danger btn-lg").addClass("btn btn-primary btn-lg");
 			$(this).text("Start playing");
 		}
	});
});



window.onload = function () {
	MIDI.loadPlugin({
		soundfontUrl: "./soundfont/",
		instrument: "acoustic_grand_piano",
		onprogress: function(state, progress) {
			console.log(state, progress);
		},
		onsuccess: function() {
			MIDI.setVolume(0, 127);
		}
	});
};