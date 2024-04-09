(function(){
	console.log("getID starting");
	try {
		var p = document.getElementById("zplayerjs-wrapper").attributes[2].textContent;
		window.prompt('ID', p);
	} catch(e){
		if(window.location.hostname != 'mp3.zing.vn')
			window.alert('this tool only work at "mp3.zing.vn"');
		else
			window.prompt('ERROR: '+e+'\nCan not get ID\n\nMake sure you are opening a SONG LINK\n'+
				'Example:', 'https://mp3.zing.vn/bai-hat/Chay-Ngay-Di-Son-Tung-M-TP/ZW9CWE6C.html');
	}
})();

