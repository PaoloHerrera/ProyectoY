$(function(){
	$('.roulette').find('img').hover(function(){
		console.log($(this).height());
	});
	var appendLogMsg = function(msg) {
		$('#msg')
	.append('<p class="muted">' + msg + '</p>')
	.scrollTop(100000000);

	}
	var p = {
		startCallback : function() {
			appendLogMsg('start');
			$('#speed, #duration').slider('disable');
			$('#stopImageNumber').spinner('disable');
			$('.start').attr('disabled', 'true');
			$('.stop').removeAttr('disabled');
		},
		slowDownCallback : function() {
			appendLogMsg('slowdown');
			$('.stop').attr('disabled', 'true');
		},
		stopCallback : function($stopElm) {
			appendLogMsg('stop');
			$('#speed, #duration').slider('enable');
			$('#stopImageNumber').spinner('enable');
			$('.start').removeAttr('disabled');
			$('.stop').attr('disabled', 'true');

			//redirecciona a la página según los datos
			//Si no gana manda al usuario a otra página
			console.log(prob)
			if(prob != 0){
				window.location.href = "/layout";
			}
			else {
				$.post("http://45.32.162.159/winprize",{ phone: phone,
					code: code,
					idUser: idUser,
					idPrize: idPrize,
					prizeName: prizename,
					localName: localName,
					branchName: branchName
				},
				function(data, status){
					alert('Felicidades!!!! te ganaste un/a ' + prizename + '\n Te llegará un SMS con tu premio.' );
				});
			}
		}

	}
	var rouletter = $('div.roulette');

	rouletter.roulette(p);
	$('.stop').click(function(){
		var stopImageNumber = $('.stopImageNumber').val();
		if(stopImageNumber == "") {
			stopImageNumber = null;
		}
		rouletter.roulette('stop');
	});
	$('.stop').attr('disabled', 'true');
	$('.start').click(function(req, res, next){
		rouletter.roulette('start');
	});

	var updateParamater = function(){
		p['speed'] = 30;
		p['duration'] = 10;
		p['stopImageNumber'] = prob;
		rouletter.roulette('option', p);
	}
	var updateSpeed = function(speed){
		$('.speed_param').text(speed);
	}
	$('#speed').slider({
		min: 1,
		max: 30,
		value : 30,
		slide: function( event, ui ) {
			updateSpeed(ui.value);
			updateParamater();
		}
	});
	updateSpeed($('#speed').slider('value'));

	var updateDuration = function(duration){
		$('.duration_param').text(duration);
	}
	$('#duration').slider({
		min: 2,
		max: 10,
		value : 10,
		slide: function( event, ui ) {
			updateDuration(ui.value);
			updateParamater();
		}
	});
	updateDuration($('#duration').slider('value'));

	var updateStopImageNumber = function(stopImageNumber) {
		$('.image_sample').children().css('opacity' , 0.2);
		$('.image_sample').children().filter('[data-value="' + stopImageNumber + '"]').css('opacity' , 1);
		$('.stop_image_number_param').text(stopImageNumber);
		updateParamater();
	}

	$('#stopImageNumber').spinner({
		spin: function( event, ui ) {
			var imageNumber = ui.value;
			if ( ui.value > 4 ) {
				$( this ).spinner( "value", -1 );
				imageNumber = 0;
				updateStopImageNumber(-1);
				return false;
			} else if ( ui.value < -1 ) {
				$( this ).spinner( "value", 4 );
				imageNumber = 4;
				updateStopImageNumber(4);
				return false;
			}
			updateStopImageNumber(imageNumber);
		}
	});
	$('#stopImageNumber').spinner('value', 0);
	updateStopImageNumber($('#stopImageNumber').spinner('value'));

	$('.image_sample').children().click(function(){
		var stopImageNumber = $(this).attr('data-value');
		$('#stopImageNumber').spinner('value', stopImageNumber);
		updateStopImageNumber(stopImageNumber);
	});
});
