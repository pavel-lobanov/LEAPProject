function TVBGameModel() {
	var self            = this;
	var VBView          = null;  // ссылка на view
	var VBController    = null;  // ссылка на controller
	self.randomWordsIDs = [];    // храним рандомное количество слов для 1-го режима
	var wordsUsesIDs    = [];    // слова, которые уже были использованы
	var wrongWordsIDs   = [];    // слова для повторения
	self.hitCounter     = 1;     // счетчик, который определяет какую подсказку взять
	var hintUses        = 0;     // сколько подсказок взято
	var gameScore       = 0;     // очки за уровень
	var repMode         = false; // режим репетиции
	var difficulty;              // сложность
	self.currWordObj;			 // текущее слово в игре
	self.currMode;				 // текущий режим

	self.init = function (view, controller) {
		VBView       = view;
		VBController = controller;
	}

	self.chooseDifficulty = function () {
		VBView.chooseDifficultyWindow();
		VBController.setDifficultyListeners();
	}

	self.startGame = function (evObj) {
		var evObj = evObj || window.event;
		difficulty = evObj.target.dataset.difficulty;
		var progress = document.querySelector('.progress');
		progress.className = 'progress progress-center';
		changeScore(0);
		VBController.setInitListeners();
		self.changeLevel();
	}

    self.changeLevel = function () {
    	if(self.currWordObj) VBController.removeLevelDoneListeners();
    	VBView.clearContent();
    	clearData();
    	if (repMode) {return self.repetitionMode()} 
    	if (wordsBase[themeNum].length === wordsUsesIDs.length) {
    		userData.score += gameScore;
    		LEAPStorage.AddValue();
			VBView.gameOver(wrongWordsIDs, hintUses, gameScore);
    		VBController.removeInitListeners();
    		VBController.gameOver();
    		return;
    	}
    	switch (difficulty) {
			case 'normal':
				self.currMode = 1;
	    		genRandomWords();
				genCurrWord();
				VBView.VBGameMode1();
				self.playSound();
				VBController.setListeners();
				break;
			case 'advanced':
				randNum = Math.floor(Math.random()*(1-0+1) )+0;
		    	if (randNum === 0) {
		    		self.currMode = 2;
					genCurrWord();
					VBView.VBGameMode2();
					self.playSound();
					VBController.setListeners();
		    	}
		    	if (randNum === 1) {
		    		self.currMode = 3;
					genCurrWord();
					VBView.VBGameMode3(); 
					VBController.setListeners();
		    	}
				break;
		}
    }

    self.checkAnswer = function(evObj) {
		var evObj  = evObj || window.event;
		var currEl = evObj.target;
        if (evObj.type === 'keydown') {
            if (evObj.keyCode === 13) {
                evObj.preventDefault();
            } else {
                return;
            }
        }

        switch (self.currMode) {
            case 1:
				var buttonDiv = currEl;
				if (buttonDiv.getAttribute('id')) {
					var targText  = buttonDiv.innerHTML;
				}else {
					break;
				}
                if (targText !== self.currWordObj.ru_translate) {
                	changeScore(-1);
                    VBView.showResult(buttonDiv, 'wrong');
                    addToRepetition();
                    VBView.vibro();
                } else {
                	changeScore(3);;
                    VBView.showResult(buttonDiv, '');
                    VBView.levelDone();
                    VBController.setLevelDoneListeners();
                    VBController.removeListeners();
                }
                break;
            case 2:
				var answerField = document.getElementById('answer-field');
				var answer      = answerField.value.toLowerCase();
                if (answer !== self.currWordObj.en_word) {
                	changeScore(-2);
                    VBView.showResult(answerField, 'wrong');
                    addToRepetition();
                    VBView.vibro();
                } else {
                	changeScore(5);
                    VBView.showResult(answerField, '');
                    VBView.levelDone();
                    VBController.setLevelDoneListeners();
                    VBController.removeListeners();
                }
                break;
            case 3:
				var answerField = document.getElementById('answer-field');
				var answer      = answerField.value.toLowerCase();
                if (answer !== self.currWordObj.en_word) {
                	changeScore(-2);
                    VBView.showResult(answerField, 'wrong');
                    addToRepetition();
                    VBView.vibro();
                } else {
                	changeScore(5);
                	setTimeout(function () {self.playSound(); }, 200);
                	VBView.showResult(answerField, '');
                    VBView.levelDone();
                    VBController.setLevelDoneListeners();
                    VBController.removeListeners();
                }
                break;
        }
	}

	self.giveMeHint = function () {
		if (self.hitCounter === 1) {VBView.showHint(); hintUses++; changeScore(-2);addToRepetition();}
		if (self.hitCounter === 2) {VBView.showHint(); hintUses++; changeScore(-3);addToRepetition();}
		self.hitCounter++;
	}

    self.repetitionMode = function () {
		VBView.clearContent();
		repMode = true;
		if (!wrongWordsIDs.length) {
			repMode = false;
			return VBView.changeTheme();
		}
		self.currWordObj = wordsBase[themeNum][wrongWordsIDs.pop()];
		switch (difficulty) {
			case 'normal':
				genRandomWords();
				randNum = Math.floor(Math.random()*7);
				self.currMode = 1;
				VBView.VBGameMode1(randNum);
				self.playSound();
				VBController.setListeners();
				break;
			case 'advanced':
				randNum = Math.floor(Math.random()*(1-0+1) )+0;
		    	if (randNum === 0) {
		    		self.currMode = 2;
					VBView.VBGameMode2();
					self.playSound();
					VBController.setListeners();
		    	}
		    	if (randNum === 1) {
		    		self.currMode = 3;
					VBView.VBGameMode3(); 
					VBController.setListeners();
		    	}
				break;
		}

	}

    self.playSound = function () {
    	VBView.playCurrWord();
    }

	var genRandomWords = function (count) {
		var i = 0;
		var j = 0;
		while(i < 6) {
	   		var randNum = Math.floor(Math.random()*( ( wordsBase[themeNum].length-1 )-0+1) )+0;
		   	if (self.randomWordsIDs.indexOf(randNum) === -1) {
		   		self.randomWordsIDs.push(randNum);
		   		i++;
		   	} else if (j>100) {
		   		break;
		   	}
		   	j++;
	   	}
   	}

   	var genCurrWord = function () {
   		var i = 0;
   		while (!i) {
   			var randNum = Math.floor(Math.random()*( ( wordsBase[themeNum].length-1 )-0+1) )+0; //берем произвольное ИД слова 
   			if (wordsUsesIDs.indexOf(randNum) === -1) { //смотрим что бы не было использованно ранее
   				self.currWordObj = wordsBase[themeNum][randNum];
	   			wordsUsesIDs.push(randNum); // добавляем слово в испольщованные
	   			if (self.currMode === 1) { // для первого режима игры
	   				if (self.randomWordsIDs.indexOf(randNum) > -1) break; // если слово есть в списке, ничего не делаем
	   				var randNum2 = Math.floor(Math.random()*( ( self.randomWordsIDs.length-1 )-0+1) )+0; 
	   				self.randomWordsIDs.splice(randNum2, 1, randNum); //иначе заменяем слово в списке на нынешнее
	   			}
	   			i++;
   			}	
   		}
   		
   	} 

   	var addToRepetition = function () {
			if (!repMode) {
				var wordToAdd = wordsUsesIDs[wordsUsesIDs.length-1]
				if (wrongWordsIDs.indexOf(wordToAdd) == -1) {
					wrongWordsIDs.push(wordToAdd);
				}
			}
   			
   	}	

   	var clearData = function () {
   		self.currWordObj = null;
   		self.randomWordsIDs = [];
   		self.hitCounter = 1;
   	};

   	self.shiftNext = function (evObj) {
   		var evObj = evObj || window.event;
   		if (evObj.ctrlKey && evObj.keyCode === 39) {
   			self.changeLevel();
   		}
   	}

   	self.mobileSoundInit = function () {
		audio.play();
		audio.pause();
    }
    self.progressBarAnimationEnd = function (evObj) {
    	var evObj = evObj || window.event;
    	evObj.target.classList.toggle('active');
    }
    var changeScore = function (scoresToChange) {
    	gameScore += scoresToChange;
    	VBView.showCurrentScore(gameScore,scoresToChange,wordsUsesIDs);
    }
    self.beforeQuit = function (evObj) {
    	var evObj = evObj || window.event;
    	switch (evObj.type){
    		case 'beforeunload':
    		evObj.returnValue = 'Возможно, внесенные изменения не сохраняться.';
    		break;
    		case 'hashchange':
    		var oldHash = window.location.hash;
    		var answer = confirm('Действительно выйти? Возможно, внесенные изменения не сохраняться.');
	    	if (answer) {
	    		VBController.removeInitListeners();
	    		window.location.hash = '';
	    		window.location.hash = oldHash;
	    	}
    		break;
    	}
    }
}
