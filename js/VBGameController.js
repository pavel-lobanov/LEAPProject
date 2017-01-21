function TVBGameController () {
	var self = this;
	var VBModel = null;
	self.init = function (model) {
		VBModel = model;
		var progressBar = document.querySelector('.progress-bar');
		AddEventHandler(progressBar,"animationend",VBModel.progressBarAnimationEnd,false);
	}
	self.setListeners = function () {
		switch (VBModel.currMode) {
			case 1:
				var checkButton = document.querySelectorAll('.check-button');
				for (var i = 0; i < checkButton.length; i++) {
				AddEventHandler(checkButton[i],'click', VBModel.checkAnswer, false);
				}
				var playWord = document.querySelector('.word-play-button');
				AddEventHandler(playWord,'click', VBModel.playSound, false);
				var hintButton = document.querySelector('.hint-button');
				AddEventHandler(hintButton,'click', VBModel.giveMeHint, false);
				break;
			case 2:
				var playWord = document.querySelector('.word-play-button');
				AddEventHandler(playWord,'click', VBModel.playSound, false);
				var hintButton = document.querySelector('.hint-button');
				AddEventHandler(hintButton,'click', VBModel.giveMeHint, false);
				var checkButton = document.querySelector('.check-answer');
				AddEventHandler(checkButton,'click', VBModel.checkAnswer, false);
				var answerField = document.getElementById('answer-field');
	            AddEventHandler(answerField,'keydown', VBModel.checkAnswer, false);
				break;
			case 3:
				var hintButton = document.querySelector('.hint-button');
				AddEventHandler(hintButton,'click', VBModel.giveMeHint, false);
				var checkButton = document.querySelector('.check-answer');
				AddEventHandler(checkButton,'click', VBModel.checkAnswer, false);
				var answerField = document.getElementById('answer-field');
	    		AddEventHandler(answerField,'keydown', VBModel.checkAnswer, false);
				break;
		}
	}
	self.removeListeners = function () {
		switch (VBModel.currMode) {
			case 1:
				var checkButton = document.querySelectorAll('.check-button');
				for (var i = 0; i < checkButton.length; i++) {
					checkButton[i].removeEventListener('click', VBModel.checkAnswer, false);
				}
				var hintButton = document.querySelector('.hint-button');
				hintButton.removeEventListener('click', VBModel.giveMeHint, false);
				break;
			case 2:
				var playWord = document.querySelector('.word-play-button');
				playWord.removeEventListener('click', VBModel.playSound, false);
				var hintButton = document.querySelector('.hint-button');
				hintButton.removeEventListener('click', VBModel.giveMeHint, false);
				var checkButton = document.querySelector('.check-answer');
				checkButton.removeEventListener('click', VBModel.checkAnswer, false);
				var answerField = document.getElementById('answer-field');
	            answerField.removeEventListener('keydown', VBModel.checkAnswer, false);
	            var checkParrent = checkButton.parentNode;
	    		checkParrent.removeChild(checkButton);
				break;
			case 3:
				var hintButton = document.querySelector('.hint-button');
				hintButton.removeEventListener('click', VBModel.giveMeHint, false);
				var checkButton = document.querySelector('.check-answer');
				checkButton.removeEventListener('click', VBModel.checkAnswer, false);
				var answerField = document.getElementById('answer-field');
	    		answerField.removeEventListener('keydown', VBModel.checkAnswer, false);
	    		var checkParrent = checkButton.parentNode;
	    		checkParrent.removeChild(checkButton);
				break;
		}
	}
	self.gameOver = function(){
		var repModeButt = document.querySelector('.repetition-mode');
		AddEventHandler(repModeButt,'click', VBModel.repetitionMode, false);
	}
	self.setLevelDoneListeners = function () {
		var changeLevel = document.querySelector('.change-level');
		AddEventHandler(changeLevel,'click', VBModel.changeLevel, false);
		$( '#content-wrapper' ).unbind('swipeleft');
		document.body.addEventListener('keyup',VBModel.shiftNext, false);
	}
	self.removeLevelDoneListeners = function () {
		var changeLevel = document.querySelector('.change-level');
		RemoveEventHandler(changeLevel,'click', VBModel.changeLevel, false);
		$( '#content-wrapper' ).unbind('swipeleft');
		document.body.removeEventListener('keyup',VBModel.shiftNext, false);
	}
	self.setInitListeners = function () {
		AddEventHandler(window,'beforeunload', VBModel.beforeQuit, false);
		AddEventHandler(window,"hashchange",VBModel.beforeQuit,false);
		window.removeEventListener('hashchange', switchToStateFromURLHash, false);
	}
	self.removeInitListeners = function () {
		RemoveEventHandler(window,'beforeunload', VBModel.beforeQuit, false);
		RemoveEventHandler(window,"hashchange",VBModel.beforeQuit,false);
		var progressBar = document.querySelector('.progress-bar');
		window.addEventListener('hashchange', switchToStateFromURLHash, false);
	}
	self.setDifficultyListeners = function () {
		var chooseButtons = document.querySelectorAll('.btn-choose');
		for (var i = 0; i < chooseButtons.length; i++) {
			AddEventHandler(chooseButtons[i],'click', VBModel.mobileSoundInit, false);
			AddEventHandler(chooseButtons[i],'click', VBModel.startGame, false);
		}
	}
	var AddEventHandler = function(Elem,EventName,HandlerFunc,CaptureFlag)
	{
	  if ( Elem.addEventListener ) {
	  	Elem.addEventListener(EventName,HandlerFunc,CaptureFlag); // современные браузеры и IE >=9	
	  }
	  else
	    if ( !CaptureFlag ) // перехват вообще невозможен
	    {
	      var EventName2='on'+EventName;
	      if ( Elem.attachEvent ) // IE <=8
	      {
	        // создаём обёртку для обработчика, чтобы обработчику правильно передавался this
	        var IEHandlerF=function() { HandlerFunc.call(Elem); } 
	        Elem.attachEvent(EventName2,IEHandlerF);
	        var StoreName="__IEHandlerF_"+EventName;
	        Elem[StoreName]=IEHandlerF; // сохраняем ссылку на обёртку, чтобы найти её при удалении обработчика
	      }
	      else // устаревшие браузеры
	        if ( !Elem[EventName2] )
	          Elem[EventName2]=HandlerFunc; // не сработает если несколько обработчиков одного события
	    }
	}
	var RemoveEventHandler = function (Elem,EventName,HandlerFunc,CaptureFlag)
	{
	  if ( Elem.removeEventListener )
	    Elem.removeEventListener(EventName,HandlerFunc,CaptureFlag);
	  else
	  {
	    if ( !CaptureFlag ) // перехват был вообще невозможен
	    {
	      var EventName2='on'+EventName;
	      if ( Elem.attachEvent ) // IE <=8
	      {
	        var StoreName="__IEHandlerF_"+EventName;
	        if ( Elem[StoreName] )
	        {
	          // при установке обработчика была создана и запомнена обёртка - удаляем
	          Elem.detachEvent(EventName2,Elem[StoreName]);
	          // не сработает правильно если было установлено несколько обработчиков одного события!
	          Elem[StoreName]=null;
	        }
	        else
	        {
	          // обёртки нет, пытаемся удалить хотя бы сам обработчик на всякий случай
	          Elem.detachEvent(EventName2,HandlerFunc);
	        }
	      }
	      else  // устаревшие браузеры
	      {
	        // удаляем обработчик только если удаляется именно тот что был ранее установлен
	        if ( Elem[EventName2]==HandlerFunc )
	          Elem[EventName2]=null;
	      }
	    }
	  }
	}
}