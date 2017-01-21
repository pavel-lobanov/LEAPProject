/*
-------------------------
 SINGLE PAGE APPLICATION
-------------------------
*/
var themeNum,wordsThemes,wordsBase,userID,userData; //номер темы, база тем, база слов, ид юзера, данные юзера
var pageLoader = false; //загрузились ли все данные через AJAX
var filesLoad = 0; //сколько файлов загружено
var LEAPStorage = new TVBStorage();
var audio = new Audio;
LEAPStorage.init(); //посылаем запрос о пользователях на сервер
window.addEventListener('hashchange', switchToStateFromURLHash, false); //следим за изменением хеша браузера
document.querySelector('.rules-btn').addEventListener('click', loadRules, false); //
document.querySelector('.result-btn').addEventListener('click', loadResult, false);//следим за кнопками в навбаре


//Загружает и переключает страницы в соответвии с названием в хеше
function switchToStateFromURLHash()
{
  var URLHash=window.location.hash;
  var StateStr=URLHash.substr(1).toLowerCase();
  var SPAState;

  if ( StateStr!="") 
  {
    if (document.querySelector('.container.hide')) document.querySelector('.container.hide').className = "container show"; 
    if (StateStr.indexOf('learning') > -1) {
    	themeNum = parseFloat( StateStr.slice(14, StateStr.length) );
      SPAState = StateStr.substr(0,8);
    } else if (StateStr.indexOf('vbgame') > -1) {
    	themeNum = parseFloat( StateStr.slice(12, StateStr.length) );
      SPAState = StateStr.substr(0,6);
    } else {
    	SPAState = StateStr;
    }
  }
  else {
    SPAState='main';
  }

  switch ( SPAState )
  {
    case 'main':
      if (document.querySelector('.container.show')) document.querySelector('.container.show').className = "container hide";
    	$("#content-wrapper").load("pages/main.html");
    	break;
    case 'vbgame':
    	$("#content-wrapper").load("pages/vbgame.html");
    	break;
    case 'learning':
    	$("#content-wrapper").load("pages/learning.html");
    	break;
    case 'result':
    	$("#content-wrapper").load("pages/result.html");
    	break;
    case 'rules':
      $("#content-wrapper").load("pages/rules.html").velocity("fadeIn", { duration: 700 });
      break;
    default:
    	$("#content-wrapper").load("pages/error_page.html").velocity("fadeIn", { duration: 700 });
    	break;
  }
}

//Загружает данные необходимые для работы
function loadPageData () {
  $.getJSON('data/themes.json', function (data) {
  wordsThemes = data;
  filesLoad++
  preloader();
  });
  $.getJSON('data/words.json', function (data) {
  wordsBase = data;
  filesLoad++;
   preloader();
   $.get('audio/sounds/top20.mp3',function(){filesLoad++;preloader();})
  for (var i = 0; i < wordsBase.length; i++) {
    $.get('img/logo/'+ i +'.png',function(){filesLoad++;preloader();});
    $.get('img/words'+ i +'.png',function(){filesLoad++;preloader();});
  }
  });
}

//Проверяет все ли файлы загружены
function preloader(){
  if (!pageLoader) {
    $('body').append('<div id="page-preloader"><div class="cssload-loader"><div class="text-loading">Загрузка</div>'+
      '<div class="cssload-inner cssload-one"></div><div class="cssload-inner cssload-two"></div><div class="cssload-inner cssload-three"></div></div></div>');
    pageLoader = true
  }
  if (filesLoad == 24) {
    $('#page-preloader').remove();
    switchToStateFromURLHash();
    checkUser();
  }
};

//Проверка представился ли пользователь
function checkUser() {
  if (localStorage.userID) {
    userID = +localStorage.userID;
    userData = LEAPStorage.GetValue(userID);
    updateNav();
  } else {
    setTimeout(function () {loadAuthWindow();},200)
  }
}

//Если представился то записываем его в навбар
function updateNav () {
  var navGreet = document.querySelector('.nav-greeting');
  var navScore = document.querySelector('.nav-scores');
  navGreet.innerHTML = 'Имя:  <strong>' + userData.name + '</strong>';
  navScore.innerHTML = 'Всего очков: <strong>' + userData.score + '</strong>';
}

//Если пользователь первый раз то спрашиваем: "как зовут?"
function loadAuthWindow () {
   var divEl = document.createElement('div');
   divEl.className = 'rules';
   $("#content-wrapper").append(divEl);
   $('.rules').load("pages/authorization.html #auth-modal", function(){
   $('#auth-modal').modal('show').unbind();
   document.querySelector('.begin-butt').addEventListener('click', newUser, false);
  }); 
}

//Добавляем пользователя к базе
function newUser () {
  $('#auth-modal').modal('hide');
  var nameField = document.querySelector('.name-field');
  var userName = nameField.value;
  if (!userName) {
    $('.modal-backdrop').remove();
    return loadAuthWindow();
  }
  var usedID = LEAPStorage.GetKeys();
  userID = usedID.length + 1;
  localStorage.userID = userID;
  userData = {};
  userData.name = userName;
  userData.score = 0;
  LEAPStorage.AddValue(userID,userData);
}


//Загружаем модальное окно ТОП20
 function loadResult () {
  var divEl = document.createElement('div');
  divEl.className = 'result';
  $("#content-wrapper").append(divEl);
  $('.result').load("pages/result.html", function(){$('#result-modal').modal('show');});
}

//Загружаем модальное окно с описанием
function loadRules () {
  var divEl = document.createElement('div');
  divEl.className = 'rules';
  $("#content-wrapper").append(divEl);
  $('.rules').load("pages/rules.html #rules-modal", function(){$('#rules-modal').modal('show')});
}

preloader();
loadPageData();
