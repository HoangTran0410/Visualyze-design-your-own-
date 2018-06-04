var myAudio;
var dropPlaylists;
var dropListMusic;
var dropListBackG;
var dropThemes;
var indexSongNow;
var info;

var backG;
var backgNow;
var objects = [];

var mic;
var AmplitudeData;
var FftData;
var ampLevel;
var fftAnalyze;
var fftWave;

var rectChooseMulti;
var designMode = false;
var mouseActive = 0; // when mouse not move after 5s -> close dat.gui
var preWidth, preHeight;
var client_id = '587aa2d384f7333a886010d5f52f302a'; // Soundcloud
var gui;

var songFromLocation = {
	haveSong : false,
	indexSong : 0
}

function setup() {
	// first setting
	createCanvas(windowWidth, windowHeight).smooth().position(0, 0).drop(getFileLocal);
	colorMode(HSB);
	angleMode(DEGREES);
	imageMode(CENTER);
	rectMode(CENTER);
	textSize(20);
	textAlign(CENTER, CENTER);
	
	preWidth = width;
	preHeight = height;
	mic = new p5.AudioIn();
	AmpData = new p5.Amplitude();
	FftData = new p5.FFT(0.4, 1024);
	
	// add object
	info = new InfoSong();
	rectChooseMulti = new rectChooseMultiObject();
	addGui();

	// from href
	var l = window.location.href;
	if(l.search("[?]") > 0){
		l = l.substring(l.search("[?]")+1);
		var check = l.substring(0, l.search("[=]"));
		if(check == 'customtheme'){
			l = l.substring(l.search("[=]")+1)
				.replace(/\%20|\+/gi, " ")
				.replace(/\%22/gi, "\"")
				.replace(/\%7B/gi, "{")
				.replace(/\%7D/gi, "{")
				.replace(/\%5B/gi, "[")
				.replace(/\%5D/gi, "]");

			var  data = JSON.parse(l);
			loadTheme(data, false, true, true);
			// addToDropdown(dropThemes, )

			// VisualizeGui.playlists = PlayList[floor(random(PlayList.length))].name;
			// getPlaylist(VisualizeGui.playlists);
		}
		else while(l.search("[=]") > 0){
			var sch = l.search("[&]");
			var left = l.substring(0, l.search("[=]"));
			var right = l.substring(l.search("[=]")+1, (sch>0)?sch:l.length);
			if(sch > 0) l = l.substring(sch+1);
			else l = "";

			console.log(left+'='+right);

			switch(left){
				case "theme":
					VisualizeGui.themes = right;
					loadJSON('default theme/'+right+'.json',
						// loaded
						function(data){loadTheme(data, false);}
					);
					break;
				case "playlist":
					getPlaylist(PlayList[right-1].name);
					break;
				case "song":
					songFromLocation.haveSong = true;
					songFromLocation.indexSong = right-1;
					break;
				case "background":
					backgNow = right-1;
					VisualizeGui.backgs = BackList[backgNow].name;
					backG = loadImage(BackList[backgNow].link);
					break;
				case "linksong":
					break;
			}
		}
	} else {
		// background
		backgNow = floor(random(0, BackList.length));
		VisualizeGui.backgs = BackList[backgNow].name;
		backG = loadImage(BackList[backgNow].link);

		// create Audio random
		VisualizeGui.playlists = PlayList[floor(random(PlayList.length))].name;
		getPlaylist(VisualizeGui.playlists);
		showFolder('Audio');

		// load theme
		var nameTheme = random(['HauMaster', 'HoangTran', 'HauMasterLite']);
		VisualizeGui.themes = nameTheme;
		loadJSON('default theme/'+nameTheme+'.json',
			// loaded
			function(data){loadTheme(data, false);},
			// error
			function(){
				var link = SongList[indexSongNow].link;
				addAudio(link);
			}
		);
	}
}

function draw(){
	if((focused && VisualizeGui.checkFocus) || !VisualizeGui.checkFocus){
		if(songFromLocation.haveSong){
			if(SongList[songFromLocation.indexSong]){
				addAudio(SongList[songFromLocation.indexSong].link);
				songFromLocation.haveSong = false;
			}
		}
		animationBackground();
		autoChangeBackFunc();

		if(second() - mouseActive > 1 && gui.closed) // auto hide dat.GUI
			gui.domElement.style.display = "none";

		// get data to visualyze
		if(myAudio){
			ampLevel = AmpData.getLevel();
			fftWave = FftData.waveform();
			fftAnalyze = FftData.analyze();
			fftAnalyze.splice(65, 1024-64);
				
			// run all objects
			for(var i = 0; i < objects.length; i++)
				objects[i].run();
		}

		// choose multi object
		if(rectChooseMulti.isActive && designMode){
			rectChooseMulti.show();
		}
	}
}

function keyPressed(){
	if(keyCode == 83) { // S key
		designMode = !designMode;
		VisualizeGui.showDesignMode = designMode;
		if(designMode) showFolder('Design');
	
	} else if(keyCode == LEFT_ARROW){
		if(myAudio.elt.currentTime >= 5 && !myAudio.elt.paused)
			myAudio.play().time(myAudio.elt.currentTime-5);

	} else if(keyCode == RIGHT_ARROW && !myAudio.elt.paused){
		if(myAudio.elt.currentTime < myAudio.elt.duration-5)
			myAudio.play().time(myAudio.elt.currentTime+5);

	} else if(keyCode == 67) {	// C key
		if(myAudio){
			if(!myAudio.elt.controls)
				myAudio.showControls();
			else myAudio.hideControls();
		}
	}
}

function mousePressed(){
	if(designMode){
		for(var i = 0; i < objects.length; i++)
			objects[i].boxcontain.mouseChoose();

		// if choose multi object => when click mouse 
		// => need to check position of mouse
		// => is mouse position inside any 'choosed' object
		var foundObjectInChoose = false;
		for(var i = 0; i < objects.length; i++){
			if(objects[i].boxcontain.allowChangepos 
			&& objects[i].boxcontain.chooseMulti){
				foundObjectInChoose = true;
				break;
			}
		}

		if(!foundObjectInChoose)
			for(var i = 0; i < objects.length; i++)
				objects[i].boxcontain.setChooseMulti(false);

	} else {
		// check if mouse click on a button
		for(var i = 0; i < objects.length; i++){
			if(objects[i].objectType == 'ButtonShape')
				objects[i].clicked();
		}
	}
}

function mouseDragged(){
	if(designMode){
		for(var i = 0; i < objects.length; i++)
			objects[i].boxcontain.drag();
	
		if(keyIsDown(CONTROL) && rectChooseMulti.isActive){
			// save end pos while drag + ctrl
			rectChooseMulti.setEnd(mouseX, mouseY);
	
		} else {
			rectChooseMulti.setActive(true);
			// begin and end position will = first pos + ctrl
			rectChooseMulti.setBegin(mouseX, mouseY);
			rectChooseMulti.setEnd(mouseX, mouseY);
		}
	}
}

function mouseReleased(){
	if(rectChooseMulti.isActive && designMode){
		for(var i = 0; i < objects.length; i++){
			if(isPointInsideRect(objects[i].pos, rectChooseMulti.beginPoint, rectChooseMulti.endPoint))
				objects[i].boxcontain.setChooseMulti(true);
		}
		rectChooseMulti.setActive(false);
	}
}

function mouseMoved() {
	mouseActive = second();
	gui.domElement.style.display = "";
}

function windowResized() {
	for(var i = 0; i < objects.length; i++){
		var newPos = createVector(objects[i].pos.x/preWidth*windowWidth, objects[i].pos.y/preHeight*windowHeight);
		var newSize = createVector(objects[i].size.x/preWidth*windowWidth, objects[i].size.y/preHeight*windowHeight);;
		objects[i].setPosition(newPos.x, newPos.y);
		objects[i].setSize(newSize.x, newSize.y);
		
		objects[i].boxcontain.applyPosition();
		objects[i].boxcontain.applySize();
	}
	resizeCanvas(windowWidth, windowHeight, true);
	preWidth = windowWidth;
	preHeight = windowHeight;
}
