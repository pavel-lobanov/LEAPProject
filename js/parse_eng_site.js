function parsePage (section) {
	var textToJSON = [];
	var enWords = document.getElementsByClassName('english');
	var ruTrans = document.getElementsByClassName('russian');
	var transcription = document.getElementsByClassName('transcription');
	var text;

	for (var i = 0; i < 6; i++) {;
		//text += '\n' + enWords[i].innerHTML + ' - ' + ruTrans[i].innerHTML;
		var jsonOBJ = {};
		jsonOBJ.en_word = enWords[i].innerHTML;
		jsonOBJ.ru_translate = ruTrans[i].innerHTML;
		jsonOBJ.transcription = transcription[i].innerHTML;
		jsonOBJ.theme = section;
		textToJSON.push(jsonOBJ);
		var formatWodrds = jsonOBJ.en_word.split(' ').join('_');
		var oggUrlStr = 'https://www.wonderenglish.com/sound/'+ formatWodrds +'.ogg';
		var mp3UrlStr = 'https://www.wonderenglish.com/sound/'+ formatWodrds +'.mp3';
		downloadFile(mp3UrlStr);
		downloadFile(oggUrlStr);
	}

	function downloadFile(url) {
		var link = document.createElement('a');
		link.setAttribute('href',url);
		link.setAttribute('download','');
		onload=link.click();
	}
	//console.log(JSON.stringify(textToJSON));
	//console.log(text);
}
function showWords (section) {
	for (var i = 0; i < wordsBase[section].length; i++) {
	 	document.write(wordsBase[section][i].en_word + ' - ' + wordsBase[section][i].ru_translate + '<br>');
	 } 
}

