var VisualizeGui = {
	themes : "",
	// music setting
		playlists : "",
		songs : "",
		deleteThisSong : function(){
			deleteCurrentObjectInList(dropListMusic, SongList, VisualizeGui.songs);
		},
		clearSongs : function(){
			updateDropDown(dropListMusic, []);
			SongList = [];
			indexSongNow = 0;
		},
		loop: false,
		rand: false,
		volume : 1,
		saveList : function() {
			var nameList = prompt("Name of Playlist: ");			
			saveJSON({nameList, SongList}, nameList+'-playlist');
		},

	// background setting
		backgs : "",
		deleteThisBack : function(){
			deleteCurrentObjectInList(dropListBackG, BackList, VisualizeGui.backgs);
		},
		clearBacks : function(){
			updateDropDown(dropListBackG, []);
			BackList = [];
			backgNow = 0;
		},
		autoChangeBack : false,
		animateBack : true,

	// focus
		checkFocus : true,
		whatthis_checkFocus : function(){
			alert(`if you turn on this mode, the visualyze will 
                 not refresh screen (redraw) IF user NOT FOCUS in this WEB`);
		},

	// connect to all audio source
		fromMic : false,
		whatthis_fromMic : function(){
			alert(`use your microphone like input source and visualize it`);
		},

	// link to current song
		linkCurrentSong : "",
		openLink : function(){
			window.open(VisualizeGui.linkCurrentSong);
		},

	// visualize folder
		showDesignMode: false,
		ampType : "lineGraph",
		add_amp : function(){
			var type = VisualizeGui.ampType;
			objects.push(new AmplitudeGraph(random(width), random(height), 100, 100, type));
		},

		fftType : "center",
		add_fft : function(){
			var type = VisualizeGui.fftType;
			objects.push(new fftGraph(random(width), random(height), 200, 100, type));
		},

	// buttons folder
		add_playBut : function(){
			objects.push(new ButtonShape(random(width), random(height), 
				120, 60, "Play", function(){animationAvatar();},  function(){playPause();}));
		},
		add_nextBut: function(){
			objects.push(new ButtonShape(random(width), random(height), 
				70, 50, "Next", null, function(){nextPre('next');}));
		},
		add_preBut : function(){
			objects.push(new ButtonShape(random(width), random(height), 
				70, 50, "Pre", null, function(){nextPre('pre');}));
		},
	// time
		timeColor: "#ffffff",
		add_time : function(){
			objects.push(new textBox(width/2, height/2, 100, 20, null, 'time'));
		},

	// title
		titleColor: "#ffae23",
		titleName : "",
		add_titleSong : function(){
			objects.push(new textBox(width/2, 100, 100, 25, info.title, 'title'));
		},

	// text
		textValue : "write your text here",
		textColor: "#ffae23",
		add_text : function(){
			objects.push(new textBox(100, height-100, 100, 25, VisualizeGui.textValue, 'text'));	
		},

	// lyric
		lyricColor : "#ffae23",
		lyricColor2: "#ffae23",
		add_lyric : function(){
			objects.push(new textBox(width/2, height/2, 100, 25, VisualizeGui.textValue, 'lyric'));	
		},

	// save theme
		savetheme : function(){
			saveTheme();
		},

	// share
		shareSong : function(){
			if(getPlaylistIndex(VisualizeGui.playlists)+1 > 50)
				alert('Can not share song from USER PLAYLIST , please choose another playlist and try again');
			else{
				var linkShare = "https://hoangtran0410.github.io/Visualyze-design-your-own-/";
				linkShare += ("?theme="+(VisualizeGui.themes||"HauMaster"));
				linkShare += ("&playlist="+(getPlaylistIndex(VisualizeGui.playlists)+1));
				linkShare += ("&song="+(indexSongNow+1));
				// linkShare += ("&linksong="+SongList[indexSongNow].link);
				linkShare += ("&background="+(backgNow+1));

				prompt("Ctrl+C to copy: ", linkShare);
			}
		},
		shareTheme : function(){
			var linkShare = "https://hoangtran0410.github.io/Visualyze-design-your-own-/";
			linkShare += "?customtheme="+saveTheme(true);

			prompt("Ctrl+C to copy: ", linkShare);
		},

	// help
		help : function(){
			help();
		},

	//About
		// github
		github : function(){
			window.open('https://github.com/HoangTran0410/Visualyze-design-your-own-'); 
		},

		// facebook
		fb: function () {
			window.open('https://www.facebook.com/people/Hoang-Tran/100004848287494');
		},

		// old version
		old : function(){
			window.open('https://hoangtran0410.github.io/VisualyzeTest/');
		}
};

function addGui(){
	gui = new dat.GUI({width:350});

	var setting = gui.addFolder('Setting');

	var audioSetting = setting.addFolder('Audio');
		dropPlaylists = audioSetting.add(VisualizeGui, 'playlists', [])
			.name('Playlist')
			.onChange(function(value){getPlaylist(value);}).listen();
		dropListMusic = audioSetting.add(VisualizeGui, 'songs', [])
			.name('List music')
			.onChange(function(value){playMusicFromName(value)}).listen();
		audioSetting.add(VisualizeGui, 'deleteThisSong').name('Delete this song');	
		audioSetting.add(VisualizeGui, 'clearSongs').name('Clear List Music');
		audioSetting.add(VisualizeGui, 'saveList').name('Save List Music').listen();
		audioSetting.add(VisualizeGui, 'loop').name('Loop song');
		audioSetting.add(VisualizeGui, 'rand').name('Random');
		audioSetting.add(VisualizeGui, 'volume', 0, 1).step(0.01).name('Volume').listen()
			.onChange(function(value){myAudio.elt.volume = value;});

		var dev = audioSetting.addFolder('Demo audio link');
			dev.add(DEV, 'linkSC').name('Link Soundcloud');
			dev.add(DEV, 'loadSC').name('Load SC');
			dev.add(DEV, 'IDzing').name('ID zingmp3');
			dev.add(DEV, 'loadId').name('Load id');
			dev.add(DEV, 'howToLoadID').name('How to get ID');
			dev.add(DEV, 'linkmedia').name('Link media');
			dev.add(DEV, 'load').name('Load');

	var backSetting = setting.addFolder('Background');
		dropListBackG = backSetting.add(VisualizeGui, 'backgs',[])
			.name('Background').listen().onChange(function(value){
						applyBackground(value);
					});
		backSetting.add(VisualizeGui, 'deleteThisBack').name('Delete this b.g');
		backSetting.add(VisualizeGui, 'clearBacks').name('Clear B.G List');
		backSetting.add(VisualizeGui, 'autoChangeBack').name('b.g AutoChange')
			.onChange(
				function(value){
					if(value) {
						autoChangeBackStep = prompt("Please enter step (in seconds):", "15");
						changeRandom = confirm("change random or not ? press OK to change random");
					}
					else autoChangeBackStep = 0;
				});
		backSetting.add(VisualizeGui, 'animateBack').name('b.g Animation ');

	var more = setting.addFolder('More');
		var connectMic = more.addFolder('Mic_Input');
			connectMic.add(VisualizeGui, 'fromMic').name('turn on')
					.onChange(function(value){
						if(value) {
							mic.start(); FftData.setInput(mic); AmpData.setInput(mic);}
						else {mic.stop(); FftData.setInput(myAudio);AmpData.setInput(myAudio);}
					});
			connectMic.add(VisualizeGui, 'whatthis_fromMic').name('What is this');
		var weakPc = more.addFolder('For weak PC');
			weakPc.add(VisualizeGui, 'checkFocus').name('only Run If Focus');
			weakPc.add(VisualizeGui, 'whatthis_checkFocus').name('What is this');
		var linkCurrentS = more.addFolder('Link this song');
			linkCurrentS.add(VisualizeGui, 'linkCurrentSong').name('Link').listen();
			linkCurrentS.add(VisualizeGui, 'openLink').name('Open in new tab');

	dropThemes = setting.add(VisualizeGui, 'themes', ['HauMasterLite', 'HauMaster', 'HoangTran'])
		.listen()
		.name('Themes')
		.onChange(function(value){
			loadJSON('default theme/'+value+'.json',
				// loaded
				function(data){
					loadTheme(data, false, true);
				},
				// error
				function(){
					alert('can"t load this theme');
				}
			);
		});

	var design = gui.addFolder("Design")
		design.add(VisualizeGui, 'showDesignMode').name('Design mode').listen()
			.onChange(function(value){designMode = value;});
		var ampFolder = design.addFolder('Amplitude');
			ampFolder.add(VisualizeGui, 'ampType', ["lineGraph","circle", "singleRect", "singleRect_Ngang"]).name('Amp Type');
			ampFolder.add(VisualizeGui, 'add_amp').name('Add Amp');
		var fftFolder = design.addFolder('FFT');
			fftFolder.add(VisualizeGui, 'fftType', ["center", "center noColor", "bottom", "bottom noColor","circle", "circle moving", "waveform"]).name('FFT Type');
			fftFolder.add(VisualizeGui, 'add_fft').name('Add FFT');
		var buts = design.addFolder('Buttons');
			buts.add(VisualizeGui, 'add_playBut').name('Play button');
			buts.add(VisualizeGui, 'add_nextBut').name('Next button');
			buts.add(VisualizeGui, 'add_preBut').name('Pre button');
		var title = design.addFolder('Title');
			title.addColor(VisualizeGui, 'titleColor').name('Title Color').listen();
			title.add(VisualizeGui, 'titleName').name('Custom Text').listen()
				.onChange(function(value){info.title = value;});
			title.add(VisualizeGui, 'add_titleSong').name('Add Title');
		var timeSong = design.addFolder('Time');
			timeSong.addColor(VisualizeGui, 'timeColor').name('Color').listen();
			timeSong.add(VisualizeGui, 'add_time').name('Add Time');
		var textbox = design.addFolder('Text Box');
			textbox.add(VisualizeGui, 'textValue').name('Your Text');
			textbox.addColor(VisualizeGui, 'textColor').name('Textbox Color').listen();
			textbox.add(VisualizeGui, 'add_text').name('Add Text');
		var lyric = design.addFolder('Lyric');
			lyric.addColor(VisualizeGui, 'lyricColor').listen();
			lyric.addColor(VisualizeGui, 'lyricColor2').listen();
			lyric.add(VisualizeGui, 'add_lyric').name('Add Lyric');
		design.add(VisualizeGui, 'savetheme').name('Save Theme');

	var sharing = gui.addFolder('Share');
		sharing.add(VisualizeGui, 'shareSong').name("Share this song");
		sharing.add(VisualizeGui, 'shareTheme').name("Share custom theme");

	var about = gui.addFolder('About');
		about.add(VisualizeGui, 'github').name('My github');
		about.add(VisualizeGui, 'fb').name('My Facebook');
		about.add(VisualizeGui, 'old').name('Old Version');
		
	gui.add(VisualizeGui, 'help').name('Help');

	updateDropDown(dropPlaylists, PlayList);
	updateDropDown(dropListMusic, SongList);
	updateDropDown(dropListBackG, BackList);
}

var DEV = {
	linkSC: "https://soundcloud.com/levipatel/as-she-passes",
	loadSC : function(){
		addAudio(DEV.linkSC);
	},

	linkmedia: `http://stream.radioreklama.bg:80/radio1128`,
	load : function(){
		createNewAudio(DEV.linkmedia);
	},
	howToLoadID : function(){
		window.open('https://hoangtran0410.github.io/Tools/get%20ID%20zingmp3%20Song/');
	},

	IDzing: "ZmxmyLmsckblnkFymybmZHyLWDhBCvJDN",
	loadId : function(){
		addAudio(DEV.IDzing);
	}
}

function getPlaylistIndex(name){
	for(var i = 0; i < PlayList.length; i++){
		if(name == PlayList[i].name){
			return i;
		}
	}
}
