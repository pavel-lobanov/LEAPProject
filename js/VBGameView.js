function TVBGameView() {
    var self = this;
    var VBModel = null;

    self.init = function(model) {
        VBModel = model;
        var mainDiv = document.getElementById('content-wrapper');
        var scoreContainer = document.createElement('div');
        scoreContainer.className = 'container VBScore';
        var scoreRow = document.createElement('div');
        scoreRow.className = 'row text-center current-score';
        var progressBar = document.createElement('div');
        progressBar.className = 'progress hide';
        progressBar.innerHTML = '<div class="progress-bar progress-bar-striped" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100" style="width: 0%"></div>';
        var gameContainer = document.createElement('div');
        gameContainer.className = 'container VBWords';
        scoreContainer.appendChild(scoreRow);
        scoreContainer.appendChild(progressBar);
        mainDiv.appendChild(scoreContainer);
        mainDiv.appendChild(gameContainer);
    }

    this.chooseDifficultyWindow = function() {
        var mainDiv = document.querySelector('.VBWords');
        var rowDiv = document.createElement('div');
        rowDiv.className = 'row';
        rowDiv.innerHTML = '<div class="panel panel-info"><div class="panel-heading">' +
            '<h3 class="panel-title">Выберите сложность</h3> </div> <div class="panel-body text-center">' +
            '<div class="row"> <button class="btn btn-success btn-choose" data-difficulty="normal">' +
            'Начальный уровень</button> <h5>Рекомендуется для первого прохождения</h5> </div> ' +
            '<div class="row"> <button class="btn btn-warning btn-choose" data-difficulty="advanced">' +
            'Продвинутый уровень</button> <h5>Рекомендуется для лучшего запоминания материала</h5> </div> </div> </div>';
        mainDiv.appendChild(rowDiv);
        $('.VBWords').velocity("fadeIn", {
            duration: 700
        });
    }
    this.VBGameMode1 = function(randNum) {
        var containerDiv = document.querySelector('.VBWords');
        var rowDiv = document.createElement('div');
        rowDiv.className = 'row';
        rowDiv.innerHTML = '<div class="text-center">' +
            '<button type="button" class="btn btn-info btn-lg word-play-button"><i class="glyphicon glyphicon-volume-up" aria-hidden="true"></i></button>' +
            '<div class="curr_word inline"><h2></h2></div> ' +
            '<button type="button" class="btn btn-default btn-lg hint-button" aria-label="Right Align"> <span>Подсказка</span> </button> <div class="hint-place"></div></div>';
        containerDiv.appendChild(rowDiv);
        var wordsCount = 0;
        var x = 0;
        for (var i = 0; i < 3; i++) {
            var rowDiv = document.createElement('div');
            rowDiv.className = 'row';
            for (var j = 0; j < 2; j++) {
                if (x === randNum) {
                    var itemWord = VBModel.currWordObj.ru_translate;
                    currWordUsed = true;

                } else {
                    var itemWord = wordsBase[themeNum][VBModel.randomWordsIDs[wordsCount]].ru_translate;
                }
                wordsCount++;
                var col = document.createElement('div')
                if (j == 0) {
                    col.className = 'col-xs-10 col-xs-offset-1 col-md-4 col-md-offset-1 check-button';
                } else {
                    col.className = 'col-xs-10 col-xs-offset-1 col-md-4 col-md-offset-2 check-button';
                }
                col.innerHTML = '<p><div class="btn btn-info btn-lg btn-block" id="answer-btn">' + itemWord + '</div></p>';
                rowDiv.appendChild(col);
                x++;
            }
            containerDiv.appendChild(rowDiv);
        }
        $('.VBWords').velocity("fadeIn", {
            duration: 700
        });
    }

    this.VBGameMode2 = function() {
        var containerDiv = document.querySelector('.VBWords');
        var rowDiv = document.createElement('div');
        rowDiv.className = 'row text-center';
        rowDiv.innerHTML = '<button type="button" class="btn btn-default btn-lg word-play-button" aria-label="Left Align">' +
            '<i class="glyphicon glyphicon-volume-up" aria-hidden="true"></i> </button> ' +
            '<button type="button" class="btn btn-default btn-lg hint-button" aria-label="Right Align"> <span>Подсказка</span> </button> <div class="hint-place"></div>' +
            '<div class="form-group"> ' +
            '<label for="answer_field">Впишите услышанное слово:</label> <input type="text" id="answer-field" required autocomplete="off" autofocus> </div> ' +
            '<button type="button" class="btn btn-info check-answer">Проверить</button>';
        containerDiv.appendChild(rowDiv);
        $('.VBWords').velocity("fadeIn", {
            duration: 700
        });
        document.querySelector('#answer-field').focus();
    }

    this.VBGameMode3 = function() {
        var containerDiv = document.querySelector('.VBWords');
        var rowDiv = document.createElement('div');
        rowDiv.className = 'row text-center';
        rowDiv.innerHTML = '<h4>' + VBModel.currWordObj.ru_translate + '</h4>' +
            '<button type="button" class="btn btn-default btn-lg hint-button" aria-label="Right Align"> <span>Подсказка</span> </button> <div class="hint-place"></div>' +
            '<div class="form-group"> ' +
            '<label for="answer_field">Напишите слово на английском:</label> <input type="text" id="answer-field" required autocomplete="off" autofocus> </div> ' +
            '<button type="button" class="btn btn-info check-answer">Проверить</button>';
        containerDiv.appendChild(rowDiv);
        $('.VBWords').velocity("fadeIn", {
            duration: 700
        });
        document.querySelector('#answer-field').focus();
    }

    self.gameOver = function(wordsWrong, hintUses, gameScore) {
        var weakWords = '';
        if (wordsWrong.length) {
            wordsWrong.forEach(function(element, index) {
                weakWords += wordsBase[themeNum][element].en_word + ', ';
                if (wordsWrong.length - 1 === index) {
                    weakWords = weakWords.slice(0, -2);
                }
            });
        }
        var mainDiv = document.getElementById('content-wrapper');
        mainDiv.removeChild(document.querySelector('.VBScore'));
        var containerDiv = document.createElement('div');
        containerDiv.className = 'container game-result VBWords';
        containerDiv.innerHTML = '<h3 class="text-center"> Поздравляем! Тема пройдена!</h3><div class="row"> <div class="col-md-4 col-md-offset-4"> <table class="table table-striped">' +
            ' <tr> <td>Количество слов:</td> <td>' + wordsBase[themeNum].length + '</td> </tr>' +
            ' <tr> <td>Количество ошибок:</td> <td>' + wordsWrong.length + '</td> </tr>' +
            ' <tr> <td>Подсказок взято:</td> <td>' + hintUses + '</td> </tr>' +
            ' <tr> <td>Вы заработали очков:</td> <td>' + gameScore + '</td> </tr>' +
            ' <tr> <td>Слабые слова:</td> <td>' + weakWords + '</td> </tr>' +
            ' <tr> <td>Всего очков:</td> <td>' + userData.score + '</td> </tr>';
        var rowDiv = document.createElement('div');
        rowDiv.className = 'row text-center';
        rowDiv.innerHTML = ' <div class="btn btn-default"><span><a href="#vbgame">Закончить</a></div>';
        if (wordsWrong.length) rowDiv.innerHTML += '<div class="btn btn-default repetition-mode"><span>Работа над ошибками</span></div>';
        rowDiv.innerHTML += ' <div class="btn btn-default"><a href="#learning_words' + (themeNum + 1) + '">Следующий урок</a></div></div>';
        containerDiv.appendChild(rowDiv);
        mainDiv.appendChild(containerDiv);
        self.vibro('long');
        updateNav();
    }

    self.showResult = function(currEl, result) {
        switch (VBModel.currMode) {
            case 1:
                if (result === 'wrong') {
                    var cssName = currEl.className;
                    currEl.className += ' btn-danger';
                    setTimeout(function() {
                        currEl.className = cssName;
                    }, 600);
                    self.playCurrWord('error');
                } else {
                    self.playCurrWord('success');
                    currEl.className = 'btn btn-success btn-lg btn-block ';
                }
                break;
            case 2:
                if (result == 'wrong') {
                    self.playCurrWord('error');
                    currEl.style.outline = '5px red auto';
                    currEl.focus();
                } else {
                    self.playCurrWord('success');
                    currEl.style.outline = '5px lightgreen auto';
                }
                break;
            case 3:
                if (result === 'wrong') {
                    self.playCurrWord('error');
                    currEl.style.outline = '5px red auto';
                    currEl.focus();
                } else {
                    self.playCurrWord('success');
                    currEl.style.outline = '5px lightgreen auto';
                }
                break;
        }
    }

    self.showHint = function() {
        var hintDiv = document.querySelector('.hint-place');
        switch (VBModel.currMode) {
            case 1:
                if (VBModel.hitCounter === 1) {
                    hintDiv.innerHTML = '<img src="img/' + themeNum + '/' + VBModel.currWordObj.en_word + '.jpg" alt="" class="img-thumbnail playImg-abs" width="150">';
                }
                if (VBModel.hitCounter === 2) {
                    hintDiv.innerHTML += '<h4>' + VBModel.currWordObj.en_word + '</h4>';
                }
                break;
            case 2:
                if (VBModel.hitCounter === 1) {
                    hintDiv.innerHTML = '<img src="img/' + themeNum + '/' + VBModel.currWordObj.en_word + '.jpg" alt="" class="img-thumbnail playImg" width="150">';
                }
                if (VBModel.hitCounter === 2) {
                    hintDiv.innerHTML += '<h4>' + VBModel.currWordObj.en_word + '</h4>';
                }
                break;
            case 3:
                if (VBModel.hitCounter === 1) VBModel.playSound();
                if (VBModel.hitCounter === 2) {
                    hintDiv.innerHTML = '<h4>' + VBModel.currWordObj.en_word + '</h4>';
                }
                break;
        }
    }

    self.playCurrWord = function(fileName) {
        audio.currentTime = 0;
        if (fileName) {
            audio.src = 'audio/sounds/' + fileName + '.mp3';
        } else {
            var soundName = VBModel.currWordObj.en_word;
            audio.src = 'audio/' + themeNum + '/' + soundName + '.mp3';
        }
        setTimeout(function() {
            audio.play()
        }, 200);
    }

    self.vibro = function(longVibro) {
        if (navigator.vibrate) {
            if (!longVibro)
                window.navigator.vibrate(300);
            else
                window.navigator.vibrate([100, 50, 100, 50, 100]);
        }
    }

    self.levelDone = function() {
        if (!document.querySelector('.shift-buttons')) {
            var gameContainer = document.querySelector('.VBWords');
            var rowDiv = document.createElement('div');
            rowDiv.innerHTML = '<div class="shift-buttons text-center">' +
                '<div class="btn btn-default btn-lg change-level">Далее</div> </div> ';
            gameContainer.appendChild(rowDiv);
            $('.shift-buttons').velocity("fadeIn", {
                duration: 700
            });
            $('.shift-buttons').velocity("scroll", {
                duration: 200
            });

        }
    }

    self.clearContent = function() {
        var wordsDiv = document.querySelector('.VBWords');
        wordsDiv.innerHTML = '';
    }

    self.changeTheme = function() {
        var mainDiv = document.getElementById('content-wrapper');
        var containerDiv = document.createElement('div');
        containerDiv.className = 'container VBWords';
        var rowDiv = document.createElement('div');
        rowDiv.className = 'row text-center';
        rowDiv.innerHTML = ' <h3>Вы молодец! Переходите к следующей теме!</h3> <div class="btn btn-default"><span><a href="#vbgame">Выбрать другую тему</a></div>' +
            ' <div class="btn btn-default"><span><a href="#learning_words' + (themeNum + 1) + '">Следующая тема</a></div>';
        containerDiv.appendChild(rowDiv);
        mainDiv.appendChild(containerDiv);
    }

    self.showCurrentScore = function(currScore, changedScore, wordsUsesIDs) {
        var scoreRow = document.querySelector('.current-score');
        var animatedScoreDiv = document.createElement('div');
        var progressBar = document.querySelector('.progress-bar');
        scoreRow.textContent = "Очков набрано: " + currScore;
        animatedScoreDiv.className = 'animated-score';
        if (changedScore > 0) {
            animatedScoreDiv.textContent = '+' + changedScore;
            animatedScoreDiv.className += ' positive-score';
            var percentComplete = Math.round(wordsUsesIDs.length * 100 / wordsBase[themeNum].length);
            progressBar.classList.toggle('active');
            progressBar.setAttribute('aria-valuenow', percentComplete);
            progressBar.style.width = percentComplete + '%';
        } else if (changedScore < 0) {
            animatedScoreDiv.textContent = changedScore;
            animatedScoreDiv.className += ' negative-score';
        }
        scoreRow.appendChild(animatedScoreDiv);
    }

}