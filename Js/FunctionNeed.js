// ======================== Effects ===========================
function playPause(){
	if(myAudio.elt.paused && myAudio.elt.duration > 0)
		myAudio.elt.play();
	else myAudio.elt.pause();
}

function nextPre(nextOrPre){
	if(nextOrPre == 'next') indexSongNow++;
	else indexSongNow--;

	var len = SongList.length;
	if(indexSongNow >= len) indexSongNow -= len;
	if(indexSongNow < 0) indexSongNow += len;

	var id = SongList[indexSongNow].id;
	addAudioFromID(id);
	VisualizeGui.songs = SongList[indexSongNow].name;
}

function animationAvatar(){
	if(info.avatar){
		push();
		translate(mouseX+info.avatar.width/2, mouseY+info.avatar.height/2);
		if(!myAudio.elt.paused && myAudio.elt.duration > 0)
			rotate(((millis()/20)%360));
		image(info.avatar, 0, 0);
		pop();
	}
}

function time(fullDetail){
	// total time
	var Se = floor(myAudio.elt.duration % 60);
	var Mi = floor((myAudio.elt.duration / 60) % 60);
	// current time
	var mili = nfc(myAudio.elt.currentTime % 60, 2);
	var s = floor(myAudio.elt.currentTime % 60);
	var m = floor((myAudio.elt.currentTime / 60) % 60);
	//Add 0 if seconds less than 10
	if(mili < 10) mili = '0' + mili;
	if(Se < 10) Se = '0' + Se;
	if (s < 10) s = '0' + s;

	if(fullDetail)
		return (m+":"+mili +" / "+ Mi+":"+Se);// for lyric
	return (m+":"+s +" / "+ Mi+":"+Se);
}

function animationBackground(){
	if(backG){
		if(VisualizeGui.animateBack){
			image(backG, width/2, height/2, width+ampLevel*50, height+ampLevel*50);
		} else image(backG, width/2, height/2, width, height);

	} else background(0);
}

var autoChangeBackStep = 15;
var alreadyChange = true;
var changeRandom = true;

function autoChangeBackFunc(){
	if(autoChangeBackStep != 0 && VisualizeGui.autoChangeBack && BackList.length > 0){
		if(second()%autoChangeBackStep == 0 && !alreadyChange){
			if(changeRandom)
				backgNow = (backgNow += floor(random(0, 5)))%BackList.length;
			else backgNow = (backgNow + 1)%BackList.length;
			VisualizeGui.backgs = BackList[backgNow].name;
			loadImage(BackList[backgNow].link,function(data) {backG = data;});
			alreadyChange = true;
			
		} else if(second()%autoChangeBackStep != 0) alreadyChange = false;
	}
}

function help(){
	alert(
	`  Visualyze Demo 2 (Design your own Visualyze)
	You can Drag to this web ONE file :
	   + image to change background (be added to list background)
	   + audio (mp3, mp4, ogg, m4a..) to play (be added to list music)
	   + lyric (.lrc) to load lyric
	   + theme (.json) to apply theme
	Key:
	   + S : on / off Design mode (new)
	   + C : on / off controls music
	   + H : on / off dat.GUI controls
	   + Left-Right arrow: jump 5s
	
	** IN DESIGN MODE:
	   + all objects has it own box contain
	   + click red button           => delete object
	   + drag "square_bottom right" => change size
	   + drag "circle_center"       => change position
	   + CTRL + drag mouse          => choose multi objects
	      => drag "circle_center" of any shape in choosed to move all objects choosed
	`);
}

//========================== Audio ================================
function createNewAudio(linkMedia){
	if(myAudio == null){
		myAudio = createAudio(linkMedia);
		myAudio.elt.controls = false;
		myAudio.autoplay(true);
		myAudio.onended(function(){if(!VisualizeGui.loop) nextPre('next'); else myAudio.play();});
		myAudio.connect(p5.soundOut);

	} else {
		myAudio.src = linkMedia;
	}
}

function addAudioFromID(id){
	if(id.substring(0, 5) != 'blob:' && id.substring(0, 6) != 'https:'){
		loadJSON("https://mp3.zing.vn/xhr/media/get-source?type=audio&key="+id,
			// loaded
			function(dataJson){
				if(dataJson.data.source[128]){
					info.updateData(dataJson);
					VisualizeGui.titleName = info.title;
					createNewAudio(info.medialink);
				} else {
					if(myAudio)
						alert("can't load this audio link from zingmp3");

					else {
						alert("can't load audio link from zingmp3, play default song");
						createNewAudio("Theo Anh - Ali Hoang Duong.mp3");
						info.setTitle('Theo Anh - Ali Hoang Duong.mp3', 'file');
					}
				}
			},
			// error
			function(e){
				alert("can't load data song from Zing mp3, play default song");
				createNewAudio("Theo Anh - Ali Hoang Duong.mp3");
				info.setTitle('Theo Anh - Ali Hoang Duong.mp3', 'file');
			}
		);
	
	} else  {
		createNewAudio(id);
		for(var i = 0; i < SongList.length; i++){
			if(SongList[i].id == id){
				info.setTitle(SongList[i].name, false);
				break;
			}
		}
	}
}

function getDataFromSoundCloud(linkInput){
	loadJSON('https://api.soundcloud.com/resolve.json?url='+linkInput
				+'&client_id='+client_id , 
    		function (result) {
        		console.log(result);
        		var numTrack = result.track_count || 1;
        		var id, title, user, link;
        		for(var i = 0; i < numTrack; i++){
    				id = result.tracks[i].id || result.id; 
    				title = result.tracks[i].title || result.title;
    				user = result.tracks[i].user.username || result.user.username;
	        		link = 'https://api.soundcloud.com/tracks/'+id
	        				+'/stream?client_id='+client_id;
	        		var name = title+" - "+user;
	        		SongList.push({"name":name, "id":link});
	        		addToDropdown(dropListMusic, name);
	        		VisualizeGui.songs = title;
	        		console.log("soundcloud: "+id+"   "+title+"   "+link);
        		}
	        	indexSongNow = SongList.length-numTrack;
	        	info.setTitle(SongList[indexSongNow].name, false);
        		createNewAudio(SongList[indexSongNow].id);
        	},
        	function (){
        		alert('Can not load this song, please try another link');
        	}
    );
}

//===================== Dropdown List (DList) ===========================
function addToDropdown(nameDList, object){
    var str = "<option value='" + object + "'>" + object + "</option>";
    nameDList.domElement.children[0].innerHTML += str;
}

function updateDropDown(nameDList, newList){
	innerHTMLStr = null;
    for(var i = 0; i < newList.length; i++){
        var str = "<option value='" + newList[i].name + "'>" + newList[i].name + "</option>";
        innerHTMLStr += str;        
    }
    nameDList.domElement.children[0].innerHTML = innerHTMLStr;
}

function deleteCurrentObjectInList(nameDList, sourceList, nameWantDelete){
	for(var i = 0; i < sourceList.length; i++){
		if(sourceList[i].name == nameWantDelete){
			sourceList.splice(i, 1);
			console.log("found");
			break;
		}
	}
	updateDropDown(nameDList, sourceList);
}

function showDropDown(element) {
    var event;
    event = document.createEvent('MouseEvents');
    event.initMouseEvent('mousedown', true, true, window);
    element.dispatchEvent(event);
}

function showFolder(folderName){
	gui.open();
	if(folderName == 'Design'){
		gui.__folders.Design.closed = false;
	
	} else {
		gui.__folders.Setting.closed = false;

		if(folderName == 'Audio'){
			gui.__folders.Setting.__folders.Audio.closed = false;
			showDropDown(gui.__folders.Setting.__folders.Audio.__ul.children[1].children[0].children[1].children[0]);
		
		} else if(folderName == 'Background'){
			gui.__folders.Setting.__folders.Background.closed = false;
			showDropDown(gui.__folders.Setting.__folders.Background.__ul.children[1].children[0].children[1].children[0]);	
		}
	}
}

// ====================== Local file , themes ============================
function getFileLocal(filein) {
	if (filein.type === 'image') {
		var url = URL.createObjectURL(filein.file);
		BackList.push({"name":filein.file.name, "link":url});
		backgNow = BackList.length-1;
		addToDropdown(dropListBackG, filein.file.name);
		VisualizeGui.backgs = filein.file.name;
		loadImage(url, function(data){backG = data; showFolder('Background');});

	} else if(filein.type === 'audio' || filein.type === 'video'){
		var url = URL.createObjectURL(filein.file);
		addToDropdown(dropListMusic, filein.file.name);
		SongList.push({"name":filein.file.name, "id":url});
		showFolder('Audio');

	} else {
		var nameFile = filein.file.name;
		var type = nameFile.substring(nameFile.length-4,nameFile.length);
		if(type == "json"){
			loadJSON(URL.createObjectURL(filein.file),
				// loaded
				function(data){
					loadTheme(data, true, true);
				},
				// error
				function(){
					alert("can't load data from this json file");
				}
			);
		
		} else if(nameFile.substring(nameFile.length-4,nameFile.length) == '.lrc'){
			info.getLyric(URL.createObjectURL(filein.file));

		} else alert('File "' + filein.file.name + '" not support , Please choose another file');
	}
}

function saveTheme(){
	var theme = {};
		theme.data = [];
	for(var i = 0; i < objects.length; i++){
		var o = objects[i];
		theme.data[i] = {};
		theme.data[i].objectType = o.objectType;
		theme.data[i].pos = {x: o.pos.x , y: o.pos.y};
		theme.data[i].size = {x: o.size.x, y: o.size.y};
		if(o.objectType == 'text'){
			theme.data[i].textInside = o.textInside;
			theme.data[i].textColor = VisualizeGui.textColor;
		} 
		else if(o.objectType == 'title')
			theme.data[i].titleColor = VisualizeGui.titleColor;
		else if(o.objectType == 'lyric'){
			theme.data[i].lyricColor = VisualizeGui.lyricColor;
			theme.data[i].lyricColor2 = VisualizeGui.lyricColor2;
		}
		else if(o.objectType == 'ButtonShape') 
			theme.data[i].name = o.name;
		else if(o.objectType == 'AmplitudeGraph' || o.objectType == 'fftGraph')
			theme.data[i].type = o.type;
	}
	theme.songNow = indexSongNow;
	theme.backgNow = backgNow;
	theme.width = width;
	theme.height = height;
	saveJSON(theme, 'yourTheme');
}

function loadTheme(dataJson, applyAudio, applyBackG){
	objects = [];
	for(var i = 0; i < dataJson.data.length; i++){
		var d = dataJson.data[i];
		// new pos & size value base on size of window (different user has different window size)
		var pos = createVector(width*(d.pos.x/dataJson.width), height*(d.pos.y/dataJson.height));
		var size = createVector(width*(d.size.x/dataJson.width), height*(d.size.y/dataJson.height));
		if(d.objectType == 'AmplitudeGraph'){
			objects.push(new AmplitudeGraph(pos.x, pos.y, size.x, size.y, d.type));
		
		} else if(d.objectType == 'fftGraph'){
			objects.push(new fftGraph(pos.x, pos.y, size.x, size.y, d.type));
		
		} else if(d.objectType == 'ButtonShape'){
			if(d.name == 'Next' || d.name == 'Pre'){
				var whenclick = (d.name == 'Next')?function(){nextPre('next');}:function(){nextPre('pre');}
				objects.push(new ButtonShape(pos.x, pos.y, size.x, size.y, d.name, null, whenclick));
			} 
			else objects.push(new ButtonShape(pos.x, pos.y, size.x, size.y, d.name,
								function(){animationAvatar();},  function(){playPause();}))
		} else if(d.objectType == 'title'){
			objects.push(new textBox(pos.x, pos.y, size.x, size.y, info.title, 'title'));
			VisualizeGui.titleColor = d.titleColor;
		
		} else if(d.objectType == 'time'){
			objects.push(new textBox(pos.x, pos.y, size.x, size.y, null, 'time'));

		} else if(d.objectType == 'lyric'){
			objects.push(new textBox(pos.x, pos.y, size.x, size.y, null, 'lyric'));
			VisualizeGui.lyricColor = d.lyricColor;
			VisualizeGui.lyricColor2 = d.lyricColor2;
		
		} else if(d.objectType == 'text'){
			objects.push(new textBox(pos.x, pos.y, size.x, size.y, d.textInside, 'text'));
			VisualizeGui.textColor = d.textColor;
		}
	}

	if(applyAudio && confirm("Do You Want To Change Audio To This Audio's Theme")){
		if(dataJson.songNow < SongList.length){
			indexSongNow = dataJson.songNow;
			VisualizeGui.songs = SongList[indexSongNow].name;
			addAudioFromID(SongList[indexSongNow].id);
		}
	}

	if(applyBackG && dataJson.backgNow < BackList.length){
		backgNow = dataJson.backgNow;
		VisualizeGui.backgs = BackList[backgNow].name;
		loadImage(BackList[backgNow].link, function(data){backG = data;});
	}
}

//======================= Choose multi objects ======================
// when ctrl + drag mouse => choose multi object
function rectChooseMultiObject(){
	this.beginPoint = createVector(0, 0); // is position of mouse when mouse down
	this.endPoint = createVector(0, 0); // is positioni of mouse when mouse drag
	this.isActive = false;

	this.setActive = function(trueOrFalse){
		this.isActive = trueOrFalse;
	}

	this.setBegin = function(x, y){
		this.beginPoint = createVector(x, y);
	}

	this.setEnd = function(x, y){
		this.endPoint = createVector(x, y);
	}

	this.show = function(){
		stroke(255);
		strokeWeight(1);
		noFill();
		var center = createVector(this.beginPoint.x+this.endPoint.x, this.beginPoint.y+this.endPoint.y).mult(0.5);
		var size = createVector(abs(this.beginPoint.x-this.endPoint.x), abs(this.beginPoint.y-this.endPoint.y));
		rect(center.x, center.y, size.x, size.y);
	}
}

function isPointInsideRect(point, beginPoint, endPoint){
	return (point.x > min(beginPoint.x, endPoint.x)
		&&  point.x < max(beginPoint.x, endPoint.x)
		&&  point.y > min(beginPoint.y, endPoint.y)
		&&  point.y < max(beginPoint.y, endPoint.y));
}

function max(x, y){
	if(x>y) return x;
	return y;
}

function min(x, y){
	if(x<y) return x;
	return y;
}

function isPointInsideRect2(point, center, size){
	return (point.x > center.x-size.x/2
		&&  point.x < center.x+size.x/2
		&&  point.y > center.y-size.y/2
		&&  point.y < center.y+size.y/2);
}

function v(x, y){
	return createVector(x, y);
}
