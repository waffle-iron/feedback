var socket = io(window.location.origin);

socket.on('connect', function () {
    console.log('I have made a persistent two-way connection to the server!');
});

$(document).ready(function() {
	
	$('.choiceButton').click(function(){
		var buttonVal = $(this).attr('title');
		console.log("Time: ",Math.floor(Date.now()/1000));
		var toSend = {message: buttonVal, time: Math.floor(Date.now()/1000)};
		socket.emit("addEmoji", toSend);
		$.post('/addFeedback',toSend);
	})

	$('.surveyChoiceButton').click(function(){
		var buttonVal = $(this).attr('title');
		var curQuestion = $('.immediateFeedback').html();
		console.log("Question: ",curQuestion);
		var toSend = {message: buttonVal, question: curQuestion, time: Math.floor(Date.now()/1000)};
		socket.emit("addEmoji", toSend);
		$.post('/addFeedback',toSend);
	})
});

socket.on('updateQuestion', function (payload) {
    console.log("payload: ",payload);
    $('.immediateFeedback').html(payload.message);
});